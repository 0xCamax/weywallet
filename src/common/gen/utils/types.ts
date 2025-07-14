export type ABIType =
	| 'function'
	| 'address'
	| 'uint256'
	| 'bool'
	| 'bytes'
	| 'string'
	| 'tuple'
	| 'mapping'
	| `${string}[]`
	| string;

export type StateMutability = 'view' | 'payable' | string | 'nonpayable';

export type LooseABIComponent = {
	name?: string;
	type: ABIType;
	inputs?: LooseABIComponent[];
	components?: LooseABIComponent[];
	stateMutability?: StateMutability;
	outputs?: LooseABIComponent[]
	internalType?: string
};

export interface Args {
	name: string;
	args: Args[] | string;
}
