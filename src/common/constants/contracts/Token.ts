
import { ContractABI } from "../../evm/abi/Contract.ts";
import { EthereumTxHex } from "../../evm/utils/types.ts";
import type { Provider } from "../../evm/Provider.ts";
import { hexlifyObject, hexlify } from "../../utils/codec.ts";
import { abi } from "../../deps.ts";


    

    export class Token {
        public provider: Provider;
        public target: string
        public abi: ContractABI = new ContractABI([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}])

		constructor(_provider: Provider, _target: string){
			this.provider = _provider
			this.target = _target
		}

        
                async name(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg0:string}}>{
			const name = this.abi.fn.get("name")
			if(!name) throw new Error("Function not defined")
			const calldata = name.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = name.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg0"]
		 const output: {arg0:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg0:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async approve(msgSender: string, _spender:string,_value:bigint | number, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg1:boolean}}>{
			const approve = this.abi.fn.get("approve")
			if(!approve) throw new Error("Function not defined")
			const calldata = approve.encodeWithSelector([_spender,_value]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = approve.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg1"]
		 const output: {arg1:boolean} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg1:boolean}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async totalSupply(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg2:bigint | number}}>{
			const totalSupply = this.abi.fn.get("totalSupply")
			if(!totalSupply) throw new Error("Function not defined")
			const calldata = totalSupply.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = totalSupply.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg2"]
		 const output: {arg2:bigint | number} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg2:bigint | number}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async transferFrom(msgSender: string, _from:string,_to:string,_value:bigint | number, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg3:boolean}}>{
			const transferFrom = this.abi.fn.get("transferFrom")
			if(!transferFrom) throw new Error("Function not defined")
			const calldata = transferFrom.encodeWithSelector([_from,_to,_value]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = transferFrom.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg3"]
		 const output: {arg3:boolean} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg3:boolean}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async decimals(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg4:bigint | number}}>{
			const decimals = this.abi.fn.get("decimals")
			if(!decimals) throw new Error("Function not defined")
			const calldata = decimals.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = decimals.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg4"]
		 const output: {arg4:bigint | number} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg4:bigint | number}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async balanceOf(msgSender: string, _owner:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{balance:bigint | number}}>{
			const balanceOf = this.abi.fn.get("balanceOf")
			if(!balanceOf) throw new Error("Function not defined")
			const calldata = balanceOf.encodeWithSelector([_owner]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = balanceOf.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["balance"]
		 const output: {balance:bigint | number} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {balance:bigint | number}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async symbol(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg5:string}}>{
			const symbol = this.abi.fn.get("symbol")
			if(!symbol) throw new Error("Function not defined")
			const calldata = symbol.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = symbol.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg5"]
		 const output: {arg5:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg5:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async transfer(msgSender: string, _to:string,_value:bigint | number, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg6:boolean}}>{
			const transfer = this.abi.fn.get("transfer")
			if(!transfer) throw new Error("Function not defined")
			const calldata = transfer.encodeWithSelector([_to,_value]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = transfer.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg6"]
		 const output: {arg6:boolean} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg6:boolean}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async allowance(msgSender: string, _owner:string,_spender:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg7:bigint | number}}>{
			const allowance = this.abi.fn.get("allowance")
			if(!allowance) throw new Error("Function not defined")
			const calldata = allowance.encodeWithSelector([_owner,_spender]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = allowance.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg7"]
		 const output: {arg7:bigint | number} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg7:bigint | number}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

    }
    