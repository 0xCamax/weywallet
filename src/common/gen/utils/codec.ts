import { LooseABIComponent, Args } from './types.ts';

let id = 0;

export function argTypesFromInput(func: LooseABIComponent): {
	args: string[];
	interfaces: string[];
	map: Map<string, unknown>;
} {
	let map: Map<string, unknown> = new Map();
	const interfaces: string[] = [];
	const args: string[] = [];
	func.inputs!.forEach((input) => {
		const name =
			input.name == undefined || input.name == ''
				? 'arg' + id++
				: input.name;
		const isArray = input.type.includes('[');
		if (input.type.includes('tuple')) {
			const {
				name: tuple_name,
				interfaces: tuple_interfaces,
				types: tuple_types,
				map: tuple_map,
			} = tupleToObject(input);
			interfaces.push(...tuple_interfaces);
			args.push(tuple_name.slice(1) + ':' + tuple_name + (isArray ? '[]' : ''));
			map = mergeMap(map, tuple_map);
			map.set(tuple_name.slice(1), tuple_types);
		} else {
			args.push(name + ':' + abiTypeToTsType(input.type));
			map.set(name, abiTypeToTsType(input.type));
		}
	});
	return { args, interfaces, map: map };
}

export function abiTypeToTsType(type: string): string {
	if (/^uint\d*(\[\d*\])*$/i.test(type) || /^int\d*(\[\d*\])*$/i.test(type)) {
		return type.includes('[') ? '(bigint | number)[]' : 'bigint | number';
	}
	if (/^address(\[\d*\])*$/i.test(type)) {
		return type.includes('[') ? 'string[]' : 'string';
	}
	if (/^bool(\[\d*\])*$/i.test(type)) {
		return type.includes('[') ? 'boolean[]' : 'boolean';
	}
	if (/^bytes\d*(\[\d*\])*$/i.test(type)) {
		return type.includes('[') ? 'string[]' : 'string';
	}
	return 'string';
}

export function tupleToObject(input: LooseABIComponent): {
	name: string;
	interfaces: string[];
	types: string[];
	map: Map<string, string[] | string>;
} {
	let map: Map<string, string[] | string> = new Map();
	const interfaces: string[] = [];
	const types: string[] = [];
    const names: string[] = [];
	const name =
		'I' +
		(input.name == undefined || input.name == ''
			? 'tupleArg' + id++
			: input.name);

	input.components!.forEach((comp) => {
		if (comp.type == 'tuple') {
			const {
				name: compName,
				interfaces: compInterface,
				types: tuple_types,
				map: _map,
			} = tupleToObject(comp);
			types.push(compName);
            names.push(compName.slice(1));
			interfaces.push(...compInterface);
			map = mergeMap(_map, map);
			map.set(compName.slice(1), tuple_types);
		} else {
			const compName = comp.name == undefined ? name : comp.name;
			types.push(abiTypeToTsType(comp.type));
            names.push(compName)
			map.set(compName, abiTypeToTsType(comp.type));
		}
	});
	const tuple_interface = `
        export interface ${name}{
        ${types.map((t, i) => names[i] + ':' + t).join(';\n')};
    }
    `;
	interfaces.push(tuple_interface);
	return {
		name,
		interfaces,
		types: names,
		map,
	};
}

export function argsData(abi: LooseABIComponent[]): {
	map: Map<string, unknown>;
	argsNames: string[];
} {
	let _map = new Map();
	const argsNames: string[] = [];
	abi.forEach((method: LooseABIComponent) => {
		if (method.type == 'function') {
			const { map, args } = argTypesFromInput(method);
			argsNames.push(...args.map((arg) => arg.split(':')[0]));
			_map = mergeMap(_map, map);
		}
	});
	return { map: _map, argsNames };
}

function mergeMap<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
	const result = new Map<K, V>();

	for (const [key, value] of map1) {
		result.set(key, value);
	}

	for (const [key, value] of map2) {
		result.set(key, value);
	}

	return result;
}

export function populateArgs(names: string[], map: Map<string, unknown>): Args[] {
	return names.map((n) => {
		const args = map.get(n);
		if (Array.isArray(args)) {
			return { name: n, args: populateArgs(args, map) };
		}
		return { name: n, args: map.get(n) } as Args;
	});
}

export function argTypesFromOutput(func: LooseABIComponent): {
	args: string[];
	interfaces: string[];
	map: Map<string, unknown>;
} {
	let map: Map<string, unknown> = new Map();
	const interfaces: string[] = [];
	const args: string[] = [];
	func.outputs!.forEach((input) => {
		const name =
			input.name == undefined || input.name == ''
				? 'arg' + id++
				: input.name;
		const isArray = input.type.includes('[');
		if (input.type.includes('tuple')) {
			const {
				name: tuple_name,
				interfaces: tuple_interfaces,
				types: tuple_types,
				map: tuple_map,
			} = tupleToObject(input);
			interfaces.push(...tuple_interfaces);
			args.push(tuple_name.slice(1) + ':' + tuple_name + (isArray ? '[]' : ''));
			map = mergeMap(map, tuple_map);
			map.set(tuple_name.slice(1), tuple_types);
		} else {
			args.push(name + ':' + abiTypeToTsType(input.type));
			map.set(name, abiTypeToTsType(input.type));
		}
	});
	return { args, interfaces, map: map };
}
