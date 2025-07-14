import { FunctionAbi } from "./Function.ts";
import { ABIFunction } from "./utils/types.ts";

export class ContractABI {
    public fn: Map<string, FunctionAbi> = new Map();
    constructor(abi: ABIFunction[]) {
        abi.forEach((a) => this.fn.set(a.name!, new FunctionAbi(a)));
    }
}