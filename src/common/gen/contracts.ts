import { LooseABIComponent } from './utils/types.ts';
import { argTypesFromInput, argTypesFromOutput } from './utils/codec.ts';

const contract_path = 'src/common/constants/contracts';

export function genContractClass(
	abi: Array<LooseABIComponent>,
	name: string
): void {
	const _interfaces: string[] = [];
	const functions: string[] = [];
	abi.forEach((method: LooseABIComponent) => {
		if (method.type == 'function') {
			const { args, interfaces } = argTypesFromInput(method);
			const { args: outputargs } = argTypesFromOutput(method)
			const hasOutput = outputargs.length > 0 
			const outNames = outputargs.map(o => o.split(":")[0])
			_interfaces.push(...interfaces);
			const payable = method.stateMutability == 'payable';
			functions.push(`
                async ${method.name}(msgSender: string, ${payable ? 'value: bigint,' : ''}${
				args.length > 0 ? args.join(',') + ',' : ''
			} chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; ${hasOutput ? "output:{" + outputargs.join(";")+ "}" : "output?:string[];"}}>{
			const ${method.name} = this.abi.fn.get("${method.name}")
			if(!${method.name}) throw new Error("Function not defined")
			const calldata = ${
				method.name
			}.encodeWithSelector([${args.map((a) => a.split(':')[0]).join(',')}]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(${payable ? 'value' : '0n'}),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = ${method.name}.decodeOutput(await this.provider.eth_call(tx))
		${hasOutput ?  `		 const names = ${JSON.stringify(outNames)}
		 const output: {${outputargs.join(";")}} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {${outputargs.join(";")}}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })` : "const output = decoded as string[]"}

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                `);
		}
	});
	const result = `
import { ContractABI } from "../../evm/abi/Contract.ts";
import { EthereumTxHex } from "../../evm/utils/types.ts";
import type { Provider } from "../../evm/Provider.ts";
import { hexlifyObject, hexlify } from "../../utils/codec.ts";
import { abi } from "../../deps.ts";


    ${_interfaces.join('\n')}

    export class ${name} {
        public provider: Provider;
        public target: string
        public abi: ContractABI = new ContractABI(${JSON.stringify(abi)})

		constructor(_provider: Provider, _target: string){
			this.provider = _provider
			this.target = _target
		}

        ${functions.join('\n')}

    }
    `;
	Deno.writeFile(
		`${contract_path}/${name}.ts`,
		new TextEncoder().encode(result)
	);
}


