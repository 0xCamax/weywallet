import { hexToUint8Array } from '../../../deps.ts';
import { ABIParameter } from './types.ts';
import { isDynamicType } from './utils.ts';

export function encodeParameterType(param: ABIParameter): string {
	if (param.type === 'tuple') {
		const inner = (param.components || []).map(encodeParameterType).join(',');
		return `(${inner})`;
	}
	const arrayMatch = param.type.match(/(.*)(\[.*\])$/);
	if (arrayMatch) {
		const base = arrayMatch[1];
		const suffix = arrayMatch[2];

		if (base === 'tuple') {
			const inner = (param.components || []).map(encodeParameterType).join(',');
			return `(${inner})${suffix}`;
		}
	}

	return param.type; // regular type like "uint256", "address", etc.
}
function padTo32Bytes(data?: Uint8Array): Uint8Array {
	if (!data || data.length === 0) {
		return new Uint8Array(32);
	}
	const padded = new Uint8Array(Math.ceil(data.length / 32) * 32);
	padded.set(data);
	return padded;
}

export function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
	const totalLen = arrays.reduce((acc, a) => acc + a.length, 0);
	const result = new Uint8Array(totalLen);

	let offset = 0;
	for (const arr of arrays) {
		result.set(arr, offset);
		offset += arr.length;
	}

	return result;
}

export function encodeDynamic(value: any, param: ABIParameter): Uint8Array {
	const { type, components } = param;

	// === string ===
	if (type === 'string') {
		const data = value ? new TextEncoder().encode(value) : new Uint8Array(0);
		const len = encodeStatic(data.length, { type: 'uint256' });

		if (data.length == 0) {
			return len;
		}
		const padded = padTo32Bytes(data);
		return concatUint8Arrays([len, padded]);
	}

	// === bytes ===
	if (type === 'bytes') {
		let data: Uint8Array;
		if (value instanceof Uint8Array) {
			data = value;
		} else if (typeof value === 'string' && value.startsWith('0x')) {
			data = hexToUint8Array(value.slice(2));
		} else if (value === '' || value === 0) {
			data = new Uint8Array(0);
		} else {
			throw new Error('Invalid bytes value');
		}
		const len = encodeStatic(data.length, { type: 'uint256' });
		if (data.length == 0) {
			return len;
		}
		const padded = padTo32Bytes(data);
		return concatUint8Arrays([len, padded]);
	}

	// === dynamic array ===
	const arrayMatch = type.match(/^(.*)\[(\d*)\]$/);
	if (arrayMatch) {
		const baseType = arrayMatch[1];
		const arrayLengthStr = arrayMatch[2];
		const isDynamicArray = arrayLengthStr === '';

		if (!Array.isArray(value)) {
			throw new Error(`Expected array value for type ${type}`);
		}

		if (isDynamicArray) {
			return encodeDynamicArray(value, param);
		} else {
			// Static-length array (e.g., uint256[3])
			const expectedLength = parseInt(arrayLengthStr, 10);
			if (value.length !== expectedLength) {
				throw new Error(
					`Array length mismatch: expected ${expectedLength}, got ${value.length}`
				);
			}

			const elems = value.map((v) =>
				isDynamicType({ type: baseType, components })
					? encodeDynamic(v, {
							type: baseType,
							components: components,
					  })
					: encodeStatic(v, {
							type: baseType,
							components: components,
					  })
			);
			return concatUint8Arrays(elems);
		}
	}

	// === tuple ===
	if (type.startsWith('tuple')) {
		if (!components) {
			throw new Error('Tuple type requires components');
		}
		// Usa encodeTuple
		return encodeTuple(value, components);
	}

	throw new Error(`Unsupported or unimplemented dynamic type: ${type}`);
}

export function encodeStatic(value: any, abi: ABIParameter): Uint8Array {
	if (
		abi.type.startsWith('uint') ||
		abi.type.startsWith('int') ||
		abi.type === 'address' ||
		abi.type === 'bool'
	) {
		let num: bigint;

		if (abi.type === 'bool') {
			num = value ? 1n : 0n;
		} else if (abi.type === 'address') {
			const address = BigInt(value);
			num = address;
		} else {
			num = BigInt(value);
		}

		const hex = num.toString(16).padStart(64, '0');
		return hexToUint8Array(hex);
	}

	if (abi.type.startsWith('bytes')) {
		const match = abi.type.match(/^bytes(\d+)$/);
		if (!match) throw new Error(`Invalid static bytes type: ${abi.type}`);
		const size = Number(match[1]);
		if (size < 1 || size > 32)
			throw new Error(`bytesN must be between 1 and 32`);

		let bytes: Uint8Array;
		if (typeof value === 'string' && value.startsWith('0x')) {
			bytes = hexToUint8Array(value);
		} else if (value instanceof Uint8Array) {
			bytes = value;
		} else {
			throw new Error(`Invalid bytes input: ${value}`);
		}

		if (bytes.length !== size) {
			throw new Error(`Expected ${size} bytes, got ${bytes.length}`);
		}

		const padded = new Uint8Array(32);
		padded.set(bytes);
		return padded;
	}

	if (abi.type === 'tuple') {
		if (!abi.components || !Array.isArray(value)) {
			throw new Error('Invalid tuple input');
		}

		const allStatic = abi.components.every((c) => !isDynamicType(c));
		if (!allStatic) {
			throw new Error(
				'Tuple contains dynamic types — use parseDynamic instead'
			);
		}

		const parts = abi.components.map((comp, i) => encodeStatic(value[i], comp));
		return concatUint8Arrays(parts);
	}

	throw new Error(`Unsupported or dynamic type in encodeStatic: ${abi.type}`);
}

function encodeTuple(
	value: any[],
	components: ABIParameter[],
	baseOffset: number = 0
): Uint8Array {
	const headChunks: Uint8Array[] = [];
	const tailChunks: Uint8Array[] = [];
	let dynamicOffset = 0;
	for (const abi of components) {
		if (isDynamicType(abi)) {
			dynamicOffset += 32;
		} else {
			dynamicOffset += staticSizeInWords(abi) * 32;
		}
	}

	for (let i = 0; i < components.length; i++) {
		const abi = components[i];
		const v = value[i];

		if (isDynamicType(abi)) {
			// Head: referencia al offset relativo al inicio de la tupla
			headChunks.push(encodeStatic(dynamicOffset, { type: 'uint256' }));

			// Tail: valor codificado dinámicamente
			let tailEncoded: Uint8Array;
			if (abi.type === 'string' || abi.type === 'bytes') {
				tailEncoded = encodeDynamic(v, abi);
			} else if (abi.type.endsWith('[]')) {
				tailEncoded = encodeDynamicArray(v, abi);
			} else if (abi.type.startsWith('tuple')) {
				tailEncoded = encodeTuple(
					v,
					abi.components!,
					baseOffset + dynamicOffset
				);
			} else {
				throw new Error(`Unsupported dynamic type in tuple: ${abi.type}`);
			}

			tailChunks.push(tailEncoded);
			dynamicOffset += tailEncoded.length;
		} else {
			// Campo estático directamente en el head
			headChunks.push(encodeStatic(v, abi));
		}
	}

	return concatUint8Arrays([...headChunks, ...tailChunks]);
}

function encodeDynamicArray(values: any[], abi: ABIParameter): Uint8Array {
	if (!abi.type.endsWith('[]')) {
		throw new Error(`Type ${abi.type} is not a dynamic array`);
	}

	// Tipo base (por ejemplo, para "tuple[]" → "tuple")
	const baseType = abi.type.slice(0, -2);
	const componentAbi: ABIParameter = abi.components
		? { type: baseType, components: abi.components }
		: { type: baseType };

	const headChunks: Uint8Array[] = [];
	const tailChunks: Uint8Array[] = [];

	let dynamicOffset = values.length * 32;

	for (let i = 0; i < values.length; i++) {
		const value = values[i];
		if (isDynamicType(componentAbi)) {
			headChunks.push(encodeStatic(dynamicOffset, { type: 'uint256' }));

			let tail: Uint8Array;

			if (componentAbi.type === 'string' || componentAbi.type === 'bytes') {
				const raw = new TextEncoder().encode(value);
				tail = concatUint8Arrays([
					encodeStatic(raw.length, { type: 'uint256' }),
					padTo32Bytes(raw),
				]);
			} else if (componentAbi.type.startsWith('tuple')) {
				tail = encodeTuple(value, componentAbi.components!);
			} else if (componentAbi.type.endsWith('[]')) {
				tail = encodeDynamicArray(value, componentAbi);
			} else {
				throw new Error(
					`Unsupported dynamic element type in array: ${componentAbi.type}`
				);
			}

			tailChunks.push(tail);
			dynamicOffset += tail.length;
		} else {
			const encoded = encodeStatic(value, componentAbi);
			headChunks.push(encoded);
		}
	}

	const lengthEncoded = encodeStatic(values.length, { type: 'uint256' });
	return concatUint8Arrays([lengthEncoded, ...headChunks, ...tailChunks]);
}

export function staticSizeInWords(param: ABIParameter): number {
	if (isDynamicType(param)) return 0;

	const { type, components } = param;

	// Casos base: tipos primitivos estáticos
	if (
		type.startsWith('uint') ||
		type.startsWith('int') ||
		type === 'bool' ||
		type === 'address' ||
		/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])$/.test(type)
	) {
		return 1;
	}

	// Tupla de sólo campos estáticos
	if (type === 'tuple') {
		if (!components || components.length === 0) return 0;
		return components.reduce((sum, c) => {
			if (isDynamicType(c)) {
				throw new Error(`Tuple has dynamic component: ${c.type}`);
			}
			return sum + staticSizeInWords(c);
		}, 0);
	}

	// Array de tamaño fijo, ej: uint256[3]
	const match = type.match(/^(.*)\[(\d+)\]$/);
	if (match) {
		const baseType = match[1];
		const length = parseInt(match[2], 10);
		if (isNaN(length))
			throw new Error(`Invalid fixed array length in type: ${type}`);

		const baseParam: ABIParameter = {
			type: baseType,
			components: param.components,
		};

		if (isDynamicType(baseParam)) {
			throw new Error(`Fixed array with dynamic base type: ${baseType}`);
		}

		return length * staticSizeInWords(baseParam);
	}

	throw new Error(
		`Unsupported or non-static type in staticSizeInWords: ${type}`
	);
}

export function uint8ArrayToHex(arr: Uint8Array): string {
	return Array.from(arr, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function hexToUint8Array(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
	}
	return bytes;
}

export function decodeStatic(
	data: Uint8Array,
	offset: number,
	param: ABIParameter
): { value: any; newOffset: number } {
	const { type, components } = param;

	// Basic numeric types, address, bool
	if (
		type.startsWith('uint') ||
		type.startsWith('int') ||
		type === 'address' ||
		type === 'bool'
	) {
		const chunk = data.slice(offset, offset + 32);
		let value: bigint | boolean | string;

		if (type === 'bool') {
			value = chunk[31] !== 0;
		} else if (type === 'address') {
			// Address is the last 20 bytes of the 32-byte chunk
			const addressBytes = chunk.slice(12, 32);
			value = '0x' + uint8ArrayToHex(addressBytes);
		} else {
			// Convert to bigint
			value = 0n;
			for (let i = 0; i < 32; i++) {
				value = (value << 8n) | BigInt(chunk[i]);
			}

			// Handle signed integers
			if (type.startsWith('int')) {
				const bitSize = parseInt(type.slice(3)) || 256;
				const maxPositive = (1n << BigInt(bitSize - 1)) - 1n;
				if (value > maxPositive) {
					value = value - (1n << BigInt(bitSize));
				}
			}
		}

		return { value, newOffset: offset + 32 };
	}

	// Fixed-size bytes (bytes1, bytes2, ..., bytes32)
	if (
		type.startsWith('bytes') &&
		/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])$/.test(type)
	) {
		const match = type.match(/^bytes(\d+)$/);
		const size = Number(match![1]);

		const chunk = data.slice(offset, offset + 32);
		const bytes = chunk.slice(0, size);

		return { value: '0x' + uint8ArrayToHex(bytes), newOffset: offset + 32 };
	}

	// Static tuple
	if (type === 'tuple') {
		if (!components || components.length === 0) {
			return { value: [], newOffset: offset };
		}

		// Verify all components are static
		const allStatic = components.every((c) => !isDynamicType(c));
		if (!allStatic) {
			throw new Error(
				'Tuple contains dynamic types - use decodeDynamic instead'
			);
		}

		const values: any[] = [];
		let currentOffset = offset;

		for (const component of components) {
			const result = decodeStatic(data, currentOffset, component);
			values.push(result.value);
			currentOffset = result.newOffset;
		}

		return { value: values, newOffset: currentOffset };
	}

	// Fixed-size array
	const arrayMatch = type.match(/^(.*)\[(\d+)\]$/);
	if (arrayMatch) {
		const baseType = arrayMatch[1];
		const length = parseInt(arrayMatch[2], 10);

		const baseParam: ABIParameter = {
			type: baseType,
			components: components,
		};

		if (isDynamicType(baseParam)) {
			throw new Error(`Fixed array with dynamic base type: ${baseType}`);
		}

		const values: any[] = [];
		let currentOffset = offset;

		for (let i = 0; i < length; i++) {
			const result = decodeStatic(data, currentOffset, baseParam);
			values.push(result.value);
			currentOffset = result.newOffset;
		}

		return { value: values, newOffset: currentOffset };
	}

	throw new Error(`Unsupported static type: ${type}`);
}

export function decodeDynamic(
	data: Uint8Array,
	offset: number,
	param: ABIParameter
): { value: any; newOffset: number } {
	const { type, components } = param;

	// String
	if (type === 'string') {
		// Read length
		const lengthChunk = data.slice(offset, offset + 32);

		let length = 0;
		for (let i = 0; i < 32; i++) {
			length = (length << 8) | lengthChunk[i];
		}

		if (length === 0) {
			return { value: '', newOffset: offset + 32 };
		}

		// Read string data
		const stringBytes = data.slice(offset + 32, offset + 32 + length);
		const value = new TextDecoder().decode(stringBytes);

		// Calculate padded length
		const paddedLength = Math.ceil(length / 32) * 32;
		return { value, newOffset: offset + 32 + paddedLength };
	}

	// Dynamic bytes
	if (type === 'bytes') {
		// Read length
		const lengthChunk = data.slice(offset, offset + 32);
		let length = 0;
		for (let i = 0; i < 32; i++) {
			length = (length << 8) | lengthChunk[i];
		}

		if (length === 0) {
			return { value: '0x', newOffset: offset + 32 };
		}

		// Read bytes data
		const bytesData = data.slice(offset + 32, offset + 32 + length);
		const value = '0x' + uint8ArrayToHex(bytesData);

		// Calculate padded length
		const paddedLength = Math.ceil(length / 32) * 32;
		return { value, newOffset: offset + 32 + paddedLength };
	}

	// Dynamic array
	const arrayMatch = type.match(/^(.*)\[(\d*)\]$/);
	if (arrayMatch) {
		const baseType = arrayMatch[1];
		const arrayLengthStr = arrayMatch[2];
		const isDynamicArray = arrayLengthStr === '';

		if (isDynamicArray) {
			return decodeDynamicArray(data, offset, param);
		} else {
			// This should be handled by decodeStatic
			throw new Error(`Fixed-size array should use decodeStatic: ${type}`);
		}
	}

	// Dynamic tuple
	if (type.startsWith('tuple')) {
		if (!components) {
			throw new Error('Tuple type requires components');
		}
		return decodeTuple(data, offset, components);
	}

	throw new Error(`Unsupported dynamic type: ${type}`);
}

function decodeTuple(
	data: Uint8Array,
	offset: number,
	components: ABIParameter[]
): { value: any[]; newOffset: number } {
	const values: any[] = [];
	let currentOffset = offset;
	const tupleStart = offset;

	// First pass: decode static fields and collect dynamic offsets
	const dynamicOffsets: number[] = [];

	for (let i = 0; i < components.length; i++) {
		const component = components[i];

		if (isDynamicType(component)) {
			// Read offset
			const offsetChunk = data.slice(currentOffset, currentOffset + 32);
			let dynamicOffset = 0;
			for (let j = 0; j < 32; j++) {
				dynamicOffset = (dynamicOffset << 8) | offsetChunk[j];
			}
			dynamicOffsets.push(tupleStart + dynamicOffset);
			values.push(null); // Placeholder
			currentOffset += 32;
		} else {
			// Decode static field
			const result = decodeStatic(data, currentOffset, component);
			values[i] = result.value;
			currentOffset = result.newOffset;
		}
	}

	// Second pass: decode dynamic fields
	let dynamicIndex = 0;
	for (let i = 0; i < components.length; i++) {
		const component = components[i];

		if (isDynamicType(component)) {
			const dynamicOffset = dynamicOffsets[dynamicIndex];
			const result = decodeDynamic(data, dynamicOffset, component);
			values[i] = result.value;
			dynamicIndex++;
		}
	}

	// Find the end of the tuple by looking at the last dynamic field or static fields
	let endOffset = currentOffset;
	if (dynamicOffsets.length > 0) {
		// Find the end of the last dynamic field
		let lastDynamicOffset = Math.max(...dynamicOffsets);
		const lastDynamicComponent = components.find(
			(c, i) =>
				isDynamicType(c) &&
				dynamicOffsets[dynamicOffsets.length - 1] === lastDynamicOffset
		);
		if (lastDynamicComponent) {
			const result = decodeDynamic(
				data,
				lastDynamicOffset,
				lastDynamicComponent
			);
			endOffset = result.newOffset;
		}
	}

	return { value: values, newOffset: endOffset };
}

function decodeDynamicArray(
	data: Uint8Array,
	offset: number,
	param: ABIParameter
): { value: any[]; newOffset: number } {
	if (!param.type.endsWith('[]')) {
		throw new Error(`Type ${param.type} is not a dynamic array`);
	}

	// Read array length
	const lengthChunk = data.slice(offset, offset + 32);
	let length = 0;
	for (let i = 0; i < 32; i++) {
		length = (length << 8) | lengthChunk[i];
	}

	if (length === 0) {
		return { value: [], newOffset: offset + 32 };
	}

	const baseType = param.type.slice(0, -2);
	const componentParam: ABIParameter = param.components
		? { type: baseType, components: param.components }
		: { type: baseType };

	const values: any[] = [];
	let currentOffset = offset + 32;
	const arrayStart = currentOffset;

	if (isDynamicType(componentParam)) {
		// Dynamic elements - read offsets first
		const offsets: number[] = [];
		for (let i = 0; i < length; i++) {
			const offsetChunk = data.slice(currentOffset, currentOffset + 32);
			let elementOffset = 0;
			for (let j = 0; j < 32; j++) {
				elementOffset = (elementOffset << 8) | offsetChunk[j];
			}
			offsets.push(arrayStart + elementOffset);
			currentOffset += 32;
		}

		// Decode dynamic elements
		for (let i = 0; i < length; i++) {
			const elementOffset = offsets[i];
			const result = decodeDynamic(data, elementOffset, componentParam);
			values.push(result.value);

			// Update currentOffset to end of last element
			if (i === length - 1) {
				currentOffset = result.newOffset;
			}
		}
	} else {
		// Static elements - decode directly
		for (let i = 0; i < length; i++) {
			const result = decodeStatic(data, currentOffset, componentParam);
			values.push(result.value);
			currentOffset = result.newOffset;
		}
	}

	return { value: values, newOffset: currentOffset };
}

export function decode(data: Uint8Array, param: ABIParameter): any {
	if (isDynamicType(param)) {
		return decodeDynamic(data, 0, param).value;
	} else {
		return decodeStatic(data, 0, param).value;
	}
}

export function decodeParameters(
	data: Uint8Array,
	params: ABIParameter[]
): any[] {
	const results: any[] = [];
	let offset = 0;
	// First pass: handle static parameters and collect dynamic offsets
	const dynamicOffsets: number[] = [];

	for (let i = 0; i < params.length; i++) {
		const param = params[i];
		if (isDynamicType(param)) {
			// Read offset
			const offsetChunk = data.slice(offset, offset + 32);

			let dynamicOffset = 0;
			for (let j = 0; j < 32; j++) {
				dynamicOffset = (dynamicOffset << 8) | offsetChunk[j];
			}
			dynamicOffsets.push(dynamicOffset);
			results.push(null); // Placeholder
			offset += 32;
		} else {
			// Decode static parameter
			const result = decodeStatic(data, offset, param);
			results[i] = result.value;
			offset = result.newOffset;
		}
	}

	// Second pass: decode dynamic parameters
	let dynamicIndex = 0;
	for (let i = 0; i < params.length; i++) {
		const param = params[i];

		if (isDynamicType(param)) {
			const dynamicOffset = dynamicOffsets[dynamicIndex];
			const result = decodeDynamic(data, dynamicOffset, param);
			results[i] = result.value;
			dynamicIndex++;
		}
	}

	return results;
}
