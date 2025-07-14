import {
	Hex,
	SigLike,
	getPublicKey,
	verify as nobleVerify,
} from '@noble/secp256k1';
import { uint8ArrayToHex, keccak256 } from '../deps.ts';
import { AccountSessionPayload, JwtHeader } from "../db/squemas.ts";



export function uint8ArrayToBase64(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes));
}



export function ecc_publicKeyFromPrivateKey(privHex: string): Uint8Array {
	return getPublicKey(privHex, false).slice(1); // sin 0x04
}

export function privateKeyToHex(key: Uint8Array): string {
	return uint8ArrayToHex(key);
}

export function verify(
	signature: Hex | SigLike,
	message: string,
	key: Uint8Array
): { valid: boolean; address: string } {
	const pub64 = ecc_publicKeyFromPrivateKey(uint8ArrayToHex(key));
	const publicKeyFull = new Uint8Array(65);
	publicKeyFull[0] = 0x04;
	publicKeyFull.set(pub64, 1);

	const valid = nobleVerify(signature, message, publicKeyFull);
	const address = '0x' + uint8ArrayToHex(keccak256(pub64).slice(-20));
	return { valid, address };
}

export function getAddress(key: string) {
	const publicKey = ecc_publicKeyFromPrivateKey(key);
	return '0x' + hexlify(keccak256(publicKey)).slice(-40);
}

export function hexlify(
	input: string | number | bigint | Uint8Array | boolean | object
) {
	try {
		if (typeof input === 'string') {
			if (input.startsWith('0x')) return input.toLowerCase();
			const encoder = new TextEncoder();
			const bytes = encoder.encode(input);
			return (
				'0x' + [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
			);
		}
		if (typeof input === 'number') {
			if (!Number.isSafeInteger(input) || input < 0)
				throw new Error(
					'Only safe positive integers are supported for hexlify.'
				);
			return '0x' + (input === 0 ? '0' : input.toString(16));
		}
		if (typeof input === 'bigint') {
			if (input < 0n) throw new Error('Negative bigints are not supported.');
			return '0x' + (input === 0n ? '0' : input.toString(16));
		}
		if (input instanceof Uint8Array) {
			const hex = Array.from(input)
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
			return '0x' + (hex === '00' ? '0' : hex);
		}
		if (typeof input === 'boolean') {
			return input ? '0x1' : '0x0';
		}
		if (input === null || input === undefined) return '0x';
		if (Array.isArray(input)) return input.map(hexlifyObject);
		return '0x';
	} catch (error) {
		throw new Error(`Unsupported type for hexlify: ${error}`);
	}
}

export function hexlifyObject(tx: object) {
	const result: Record<string, unknown> = {};
	Object.entries(tx).forEach(([k, v]) => {
		result[k] = hexlify(v);
	});
	return result;
}

// 🔢 Calcula el valor `v` de una firma en base a chainId y paridad
export function computeV(chainId: string, yParity: string) {
	if (!chainId) throw new Error('chainId is required to compute v');
	const recovery = BigInt(yParity ?? '0x0');
	const id = BigInt(chainId);
	const v = id * 2n + 35n + recovery;
	return '0x' + v.toString(16);
}

export async function encode64(bytes: string): Promise<string> {
	const { encode64: e64 } = (
		await import(
			'https://esm.sh/node-forge@1.3.1?bundle&target=es2022&deno-std=0.224.0'
		)
	).default.util;
	const b64 = e64(bytes);
	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export async function decode64(encoded: string): Promise<string> {
	const { decode64: d64 } = (
		await import(
			'https://esm.sh/node-forge@1.3.1?bundle&target=es2022&deno-std=0.224.0'
		)
	).default.util;
	return d64(
		encoded
			.replace(/-/g, '+')
			.replace(/_/g, '/')
			.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), '=')
	);
}

export async function parseJWT(token: string): Promise<{
	header: JwtHeader;
	payload: AccountSessionPayload;
	signature: string;
}> {
	const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
	if (!encodedHeader || !encodedPayload || !encodedSignature)
		throw new Error('Malformed token');

	return {
		header: JSON.parse(await decode64(encodedHeader)),
		payload: JSON.parse(await decode64(encodedPayload)) as AccountSessionPayload,
		signature: encodedSignature,
	};
}
