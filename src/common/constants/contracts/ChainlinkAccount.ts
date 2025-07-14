
import { ContractABI } from "../../evm/abi/Contract.ts";
import { EthereumTxHex } from "../../evm/utils/types.ts";
import type { Provider } from "../../evm/Provider.ts";
import { hexlifyObject, hexlify } from "../../utils/codec.ts";
import { abi } from "../../deps.ts";


    
        export interface ItupleArg10{
        messageId:string;
sourceChainSelector:bigint | number;
sender:string;
data:string;
destTokenAmounts:string;
    }
    

        export interface Icalls{
        target:string;
value:bigint | number;
data:string;
    }
    

        export interface Iminute{
        fieldType:bigint | number;
singleValue:bigint | number;
interval:bigint | number;
rangeStart:bigint | number;
rangeEnd:bigint | number;
listLength:bigint | number;
list:(bigint | number)[];
    }
    

        export interface Ihour{
        fieldType:bigint | number;
singleValue:bigint | number;
interval:bigint | number;
rangeStart:bigint | number;
rangeEnd:bigint | number;
listLength:bigint | number;
list:(bigint | number)[];
    }
    

        export interface Iday{
        fieldType:bigint | number;
singleValue:bigint | number;
interval:bigint | number;
rangeStart:bigint | number;
rangeEnd:bigint | number;
listLength:bigint | number;
list:(bigint | number)[];
    }
    

        export interface Imonth{
        fieldType:bigint | number;
singleValue:bigint | number;
interval:bigint | number;
rangeStart:bigint | number;
rangeEnd:bigint | number;
listLength:bigint | number;
list:(bigint | number)[];
    }
    

        export interface IdayOfWeek{
        fieldType:bigint | number;
singleValue:bigint | number;
interval:bigint | number;
rangeStart:bigint | number;
rangeEnd:bigint | number;
listLength:bigint | number;
list:(bigint | number)[];
    }
    

        export interface Ispec{
        minute:Iminute;
hour:Ihour;
day:Iday;
month:Imonth;
dayOfWeek:IdayOfWeek;
    }
    

        export interface Icalls{
        target:string;
value:bigint | number;
data:string;
    }
    

        export interface ItupleArg15{
        target:string;
value:bigint | number;
data:string;
    }
    

        export interface IextraArgs{
        gasLimit:bigint | number;
allowOutOfOrderExecution:boolean;
    }
    

        export interface ItupleArg17{
        chain:bigint | number;
feeToken:string;
transferTokens:string;
extraArgs:IextraArgs;
    }
    

        export interface InewCall{
        target:string;
value:bigint | number;
data:string;
    }
    

        export interface IuserOp{
        sender:string;
nonce:bigint | number;
initCode:string;
callData:string;
accountGasLimits:string;
preVerificationGas:bigint | number;
gasFees:string;
paymasterAndData:string;
signature:string;
    }
    

    export class ChainlinkAccount {
        public provider: Provider;
        public target: string
        public abi: ContractABI = new ContractABI([{"type":"fallback","stateMutability":"payable"},{"type":"receive","stateMutability":"payable"},{"type":"function","name":"UPKEEPS_ID_SLOT","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"ccipReceive","inputs":[{"name":"","type":"tuple","internalType":"struct Client.Any2EVMMessage","components":[{"name":"messageId","type":"bytes32","internalType":"bytes32"},{"name":"sourceChainSelector","type":"uint64","internalType":"uint64"},{"name":"sender","type":"bytes","internalType":"bytes"},{"name":"data","type":"bytes","internalType":"bytes"},{"name":"destTokenAmounts","type":"tuple[]","internalType":"struct Client.EVMTokenAmount[]","components":[{"name":"token","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}]}]}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"checkUpkeep","inputs":[{"name":"checkData","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bool","internalType":"bool"},{"name":"","type":"bytes","internalType":"bytes"}],"stateMutability":"view"},{"type":"function","name":"createCronJobFromSpec","inputs":[{"name":"calls","type":"tuple[]","internalType":"struct Call[]","components":[{"name":"target","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}]},{"name":"spec","type":"tuple","internalType":"struct Spec","components":[{"name":"minute","type":"tuple","internalType":"struct Field","components":[{"name":"fieldType","type":"uint8","internalType":"enum FieldType"},{"name":"singleValue","type":"uint8","internalType":"uint8"},{"name":"interval","type":"uint8","internalType":"uint8"},{"name":"rangeStart","type":"uint8","internalType":"uint8"},{"name":"rangeEnd","type":"uint8","internalType":"uint8"},{"name":"listLength","type":"uint8","internalType":"uint8"},{"name":"list","type":"uint8[26]","internalType":"uint8[26]"}]},{"name":"hour","type":"tuple","internalType":"struct Field","components":[{"name":"fieldType","type":"uint8","internalType":"enum FieldType"},{"name":"singleValue","type":"uint8","internalType":"uint8"},{"name":"interval","type":"uint8","internalType":"uint8"},{"name":"rangeStart","type":"uint8","internalType":"uint8"},{"name":"rangeEnd","type":"uint8","internalType":"uint8"},{"name":"listLength","type":"uint8","internalType":"uint8"},{"name":"list","type":"uint8[26]","internalType":"uint8[26]"}]},{"name":"day","type":"tuple","internalType":"struct Field","components":[{"name":"fieldType","type":"uint8","internalType":"enum FieldType"},{"name":"singleValue","type":"uint8","internalType":"uint8"},{"name":"interval","type":"uint8","internalType":"uint8"},{"name":"rangeStart","type":"uint8","internalType":"uint8"},{"name":"rangeEnd","type":"uint8","internalType":"uint8"},{"name":"listLength","type":"uint8","internalType":"uint8"},{"name":"list","type":"uint8[26]","internalType":"uint8[26]"}]},{"name":"month","type":"tuple","internalType":"struct Field","components":[{"name":"fieldType","type":"uint8","internalType":"enum FieldType"},{"name":"singleValue","type":"uint8","internalType":"uint8"},{"name":"interval","type":"uint8","internalType":"uint8"},{"name":"rangeStart","type":"uint8","internalType":"uint8"},{"name":"rangeEnd","type":"uint8","internalType":"uint8"},{"name":"listLength","type":"uint8","internalType":"uint8"},{"name":"list","type":"uint8[26]","internalType":"uint8[26]"}]},{"name":"dayOfWeek","type":"tuple","internalType":"struct Field","components":[{"name":"fieldType","type":"uint8","internalType":"enum FieldType"},{"name":"singleValue","type":"uint8","internalType":"uint8"},{"name":"interval","type":"uint8","internalType":"uint8"},{"name":"rangeStart","type":"uint8","internalType":"uint8"},{"name":"rangeEnd","type":"uint8","internalType":"uint8"},{"name":"listLength","type":"uint8","internalType":"uint8"},{"name":"list","type":"uint8[26]","internalType":"uint8[26]"}]}]}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"deleteCronJob","inputs":[{"name":"id","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"entryPoint","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IEntryPoint"}],"stateMutability":"pure"},{"type":"function","name":"execute","inputs":[{"name":"target","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"executeBatch","inputs":[{"name":"calls","type":"tuple[]","internalType":"struct BaseAccount.Call[]","components":[{"name":"target","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}]}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"executeCCIP","inputs":[{"name":"","type":"tuple[]","internalType":"struct BaseAccount.Call[]","components":[{"name":"target","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}]},{"name":"","type":"tuple","internalType":"struct Config","components":[{"name":"chain","type":"uint64","internalType":"uint64"},{"name":"feeToken","type":"address","internalType":"address"},{"name":"transferTokens","type":"tuple[]","internalType":"struct Client.EVMTokenAmount[]","components":[{"name":"token","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}]},{"name":"extraArgs","type":"tuple","internalType":"struct Client.GenericExtraArgsV2","components":[{"name":"gasLimit","type":"uint256","internalType":"uint256"},{"name":"allowOutOfOrderExecution","type":"bool","internalType":"bool"}]}]}],"outputs":[{"name":"messageId","type":"bytes32","internalType":"bytes32"}],"stateMutability":"nonpayable"},{"type":"function","name":"feeTokenInfo","inputs":[],"outputs":[{"name":"maxFee","type":"uint96","internalType":"uint96"},{"name":"token","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getActiveCronJobIDs","inputs":[],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getCronJob","inputs":[{"name":"id","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"calls","type":"tuple[]","internalType":"struct Call[]","components":[{"name":"target","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}]},{"name":"cronString","type":"string","internalType":"string"},{"name":"nextTick","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getNonce","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"isValidSignature","inputs":[{"name":"hash","type":"bytes32","internalType":"bytes32"},{"name":"signature","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"magicValue","type":"bytes4","internalType":"bytes4"}],"stateMutability":"view"},{"type":"function","name":"keeperRegister","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IKeeperRegistryUI"}],"stateMutability":"view"},{"type":"function","name":"onERC1155BatchReceived","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256[]","internalType":"uint256[]"},{"name":"","type":"uint256[]","internalType":"uint256[]"},{"name":"","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"onERC1155Received","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"onERC721Received","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"performUpkeep","inputs":[{"name":"performData","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"registerUpkeep","inputs":[{"name":"name","type":"string","internalType":"string"},{"name":"gasLimit","type":"uint32","internalType":"uint32"},{"name":"offchainConfig","type":"bytes","internalType":"bytes"},{"name":"checkData","type":"bytes","internalType":"bytes"},{"name":"amount","type":"uint96","internalType":"uint96"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"setConditionDelegatee","inputs":[{"name":"delegatee","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setFeeTokenInfo","inputs":[{"name":"maxFee","type":"uint96","internalType":"uint96"},{"name":"token","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setForwarder","inputs":[{"name":"newForwarder","type":"address","internalType":"address"},{"name":"allowed","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"supportsInterface","inputs":[{"name":"id","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"pure"},{"type":"function","name":"unlockCallback","inputs":[{"name":"","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes","internalType":"bytes"}],"stateMutability":"nonpayable"},{"type":"function","name":"updateCronJob","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"newCall","type":"tuple[]","internalType":"struct Call[]","components":[{"name":"target","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}]},{"name":"newEncodedCronSpec","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"upkeeps","inputs":[{"name":"","type":"bytes32","internalType":"bytes32"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"validateUserOp","inputs":[{"name":"userOp","type":"tuple","internalType":"struct PackedUserOperation","components":[{"name":"sender","type":"address","internalType":"address"},{"name":"nonce","type":"uint256","internalType":"uint256"},{"name":"initCode","type":"bytes","internalType":"bytes"},{"name":"callData","type":"bytes","internalType":"bytes"},{"name":"accountGasLimits","type":"bytes32","internalType":"bytes32"},{"name":"preVerificationGas","type":"uint256","internalType":"uint256"},{"name":"gasFees","type":"bytes32","internalType":"bytes32"},{"name":"paymasterAndData","type":"bytes","internalType":"bytes"},{"name":"signature","type":"bytes","internalType":"bytes"}]},{"name":"userOpHash","type":"bytes32","internalType":"bytes32"},{"name":"missingAccountFunds","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"validationData","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"error","name":"CheckUpkeepError","inputs":[]},{"type":"error","name":"CronJobIDNotFound","inputs":[{"name":"id","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ECDSAInvalidSignature","inputs":[]},{"type":"error","name":"ECDSAInvalidSignatureLength","inputs":[{"name":"length","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ECDSAInvalidSignatureS","inputs":[{"name":"s","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"ExecuteCCIPError","inputs":[]},{"type":"error","name":"ExecuteError","inputs":[{"name":"index","type":"uint256","internalType":"uint256"},{"name":"error","type":"bytes","internalType":"bytes"}]},{"type":"error","name":"FeeTokenError","inputs":[]},{"type":"error","name":"InvalidHandler","inputs":[]},{"type":"error","name":"NotPoolManager","inputs":[]},{"type":"error","name":"PerformError","inputs":[]},{"type":"error","name":"PerformUpkeepError","inputs":[]},{"type":"error","name":"ReceiveCCIPError","inputs":[]},{"type":"error","name":"TickDoesntMatchSpec","inputs":[]},{"type":"error","name":"TickInFuture","inputs":[]},{"type":"error","name":"TickTooOld","inputs":[]},{"type":"error","name":"Unknown","inputs":[{"name":"","type":"bytes","internalType":"bytes"}]},{"type":"error","name":"UnknownFieldType","inputs":[]}])

		constructor(_provider: Provider, _target: string){
			this.provider = _provider
			this.target = _target
		}

        
                async UPKEEPS_ID_SLOT(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg8:string}}>{
			const UPKEEPS_ID_SLOT = this.abi.fn.get("UPKEEPS_ID_SLOT")
			if(!UPKEEPS_ID_SLOT) throw new Error("Function not defined")
			const calldata = UPKEEPS_ID_SLOT.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = UPKEEPS_ID_SLOT.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg8"]
		 const output: {arg8:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg8:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async ccipReceive(msgSender: string, tupleArg10:ItupleArg10, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const ccipReceive = this.abi.fn.get("ccipReceive")
			if(!ccipReceive) throw new Error("Function not defined")
			const calldata = ccipReceive.encodeWithSelector([tupleArg10]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = ccipReceive.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async checkUpkeep(msgSender: string, checkData:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg11:boolean;arg12:string}}>{
			const checkUpkeep = this.abi.fn.get("checkUpkeep")
			if(!checkUpkeep) throw new Error("Function not defined")
			const calldata = checkUpkeep.encodeWithSelector([checkData]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = checkUpkeep.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg11","arg12"]
		 const output: {arg11:boolean;arg12:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg11:boolean;arg12:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async createCronJobFromSpec(msgSender: string, calls:Icalls[],spec:Ispec, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const createCronJobFromSpec = this.abi.fn.get("createCronJobFromSpec")
			if(!createCronJobFromSpec) throw new Error("Function not defined")
			const calldata = createCronJobFromSpec.encodeWithSelector([calls,spec]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = createCronJobFromSpec.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async deleteCronJob(msgSender: string, id:bigint | number, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const deleteCronJob = this.abi.fn.get("deleteCronJob")
			if(!deleteCronJob) throw new Error("Function not defined")
			const calldata = deleteCronJob.encodeWithSelector([id]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = deleteCronJob.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async entryPoint(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg13:string}}>{
			const entryPoint = this.abi.fn.get("entryPoint")
			if(!entryPoint) throw new Error("Function not defined")
			const calldata = entryPoint.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = entryPoint.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg13"]
		 const output: {arg13:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg13:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async execute(msgSender: string, target:string,value:bigint | number,data:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const execute = this.abi.fn.get("execute")
			if(!execute) throw new Error("Function not defined")
			const calldata = execute.encodeWithSelector([target,value,data]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = execute.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async executeBatch(msgSender: string, calls:Icalls[], chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const executeBatch = this.abi.fn.get("executeBatch")
			if(!executeBatch) throw new Error("Function not defined")
			const calldata = executeBatch.encodeWithSelector([calls]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = executeBatch.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async executeCCIP(msgSender: string, tupleArg15:ItupleArg15[],tupleArg17:ItupleArg17, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{messageId:string}}>{
			const executeCCIP = this.abi.fn.get("executeCCIP")
			if(!executeCCIP) throw new Error("Function not defined")
			const calldata = executeCCIP.encodeWithSelector([tupleArg15,tupleArg17]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = executeCCIP.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["messageId"]
		 const output: {messageId:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {messageId:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async feeTokenInfo(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{maxFee:bigint | number;token:string}}>{
			const feeTokenInfo = this.abi.fn.get("feeTokenInfo")
			if(!feeTokenInfo) throw new Error("Function not defined")
			const calldata = feeTokenInfo.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = feeTokenInfo.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["maxFee","token"]
		 const output: {maxFee:bigint | number;token:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {maxFee:bigint | number;token:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async getActiveCronJobIDs(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg18:(bigint | number)[]}}>{
			const getActiveCronJobIDs = this.abi.fn.get("getActiveCronJobIDs")
			if(!getActiveCronJobIDs) throw new Error("Function not defined")
			const calldata = getActiveCronJobIDs.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = getActiveCronJobIDs.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg18"]
		 const output: {arg18:(bigint | number)[]} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg18:(bigint | number)[]}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async getCronJob(msgSender: string, id:bigint | number, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{calls:Icalls[];cronString:string;nextTick:bigint | number}}>{
			const getCronJob = this.abi.fn.get("getCronJob")
			if(!getCronJob) throw new Error("Function not defined")
			const calldata = getCronJob.encodeWithSelector([id]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = getCronJob.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["calls","cronString","nextTick"]
		 const output: {calls:Icalls[];cronString:string;nextTick:bigint | number} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {calls:Icalls[];cronString:string;nextTick:bigint | number}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async getNonce(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg19:bigint | number}}>{
			const getNonce = this.abi.fn.get("getNonce")
			if(!getNonce) throw new Error("Function not defined")
			const calldata = getNonce.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = getNonce.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg19"]
		 const output: {arg19:bigint | number} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg19:bigint | number}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async isValidSignature(msgSender: string, hash:string,signature:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{magicValue:string}}>{
			const isValidSignature = this.abi.fn.get("isValidSignature")
			if(!isValidSignature) throw new Error("Function not defined")
			const calldata = isValidSignature.encodeWithSelector([hash,signature]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = isValidSignature.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["magicValue"]
		 const output: {magicValue:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {magicValue:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async keeperRegister(msgSender: string,  chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg20:string}}>{
			const keeperRegister = this.abi.fn.get("keeperRegister")
			if(!keeperRegister) throw new Error("Function not defined")
			const calldata = keeperRegister.encodeWithSelector([]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = keeperRegister.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg20"]
		 const output: {arg20:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg20:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async onERC1155BatchReceived(msgSender: string, arg21:string,arg22:string,arg23:(bigint | number)[],arg24:(bigint | number)[],arg25:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg26:string}}>{
			const onERC1155BatchReceived = this.abi.fn.get("onERC1155BatchReceived")
			if(!onERC1155BatchReceived) throw new Error("Function not defined")
			const calldata = onERC1155BatchReceived.encodeWithSelector([arg21,arg22,arg23,arg24,arg25]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = onERC1155BatchReceived.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg26"]
		 const output: {arg26:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg26:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async onERC1155Received(msgSender: string, arg27:string,arg28:string,arg29:bigint | number,arg30:bigint | number,arg31:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg32:string}}>{
			const onERC1155Received = this.abi.fn.get("onERC1155Received")
			if(!onERC1155Received) throw new Error("Function not defined")
			const calldata = onERC1155Received.encodeWithSelector([arg27,arg28,arg29,arg30,arg31]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = onERC1155Received.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg32"]
		 const output: {arg32:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg32:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async onERC721Received(msgSender: string, arg33:string,arg34:string,arg35:bigint | number,arg36:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg37:string}}>{
			const onERC721Received = this.abi.fn.get("onERC721Received")
			if(!onERC721Received) throw new Error("Function not defined")
			const calldata = onERC721Received.encodeWithSelector([arg33,arg34,arg35,arg36]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = onERC721Received.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg37"]
		 const output: {arg37:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg37:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async performUpkeep(msgSender: string, performData:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const performUpkeep = this.abi.fn.get("performUpkeep")
			if(!performUpkeep) throw new Error("Function not defined")
			const calldata = performUpkeep.encodeWithSelector([performData]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = performUpkeep.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async registerUpkeep(msgSender: string, value: bigint,name:string,gasLimit:bigint | number,offchainConfig:string,checkData:string,amount:bigint | number, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const registerUpkeep = this.abi.fn.get("registerUpkeep")
			if(!registerUpkeep) throw new Error("Function not defined")
			const calldata = registerUpkeep.encodeWithSelector([name,gasLimit,offchainConfig,checkData,amount]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(value),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = registerUpkeep.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async setConditionDelegatee(msgSender: string, delegatee:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const setConditionDelegatee = this.abi.fn.get("setConditionDelegatee")
			if(!setConditionDelegatee) throw new Error("Function not defined")
			const calldata = setConditionDelegatee.encodeWithSelector([delegatee]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = setConditionDelegatee.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async setFeeTokenInfo(msgSender: string, maxFee:bigint | number,token:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const setFeeTokenInfo = this.abi.fn.get("setFeeTokenInfo")
			if(!setFeeTokenInfo) throw new Error("Function not defined")
			const calldata = setFeeTokenInfo.encodeWithSelector([maxFee,token]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = setFeeTokenInfo.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async setForwarder(msgSender: string, newForwarder:string,allowed:boolean, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const setForwarder = this.abi.fn.get("setForwarder")
			if(!setForwarder) throw new Error("Function not defined")
			const calldata = setForwarder.encodeWithSelector([newForwarder,allowed]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = setForwarder.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async supportsInterface(msgSender: string, id:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg38:boolean}}>{
			const supportsInterface = this.abi.fn.get("supportsInterface")
			if(!supportsInterface) throw new Error("Function not defined")
			const calldata = supportsInterface.encodeWithSelector([id]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = supportsInterface.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg38"]
		 const output: {arg38:boolean} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg38:boolean}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async unlockCallback(msgSender: string, arg39:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg40:string}}>{
			const unlockCallback = this.abi.fn.get("unlockCallback")
			if(!unlockCallback) throw new Error("Function not defined")
			const calldata = unlockCallback.encodeWithSelector([arg39]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = unlockCallback.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg40"]
		 const output: {arg40:string} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg40:string}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async updateCronJob(msgSender: string, id:bigint | number,newCall:InewCall[],newEncodedCronSpec:string, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output?:string[];}>{
			const updateCronJob = this.abi.fn.get("updateCronJob")
			if(!updateCronJob) throw new Error("Function not defined")
			const calldata = updateCronJob.encodeWithSelector([id,newCall,newEncodedCronSpec]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = updateCronJob.decodeOutput(await this.provider.eth_call(tx))
		const output = decoded as string[]

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async upkeeps(msgSender: string, arg41:string,arg42:bigint | number, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{arg43:bigint | number}}>{
			const upkeeps = this.abi.fn.get("upkeeps")
			if(!upkeeps) throw new Error("Function not defined")
			const calldata = upkeeps.encodeWithSelector([arg41,arg42]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = upkeeps.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["arg43"]
		 const output: {arg43:bigint | number} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {arg43:bigint | number}
		 decoded.forEach((d, i) => {
			output[names[i]] = d
		 })

		 try {
return { tx: await this.provider.populateTransaction(tx), output}
		 } catch {
		  return { tx, output}
		  }
				
                }
                

                async validateUserOp(msgSender: string, userOp:IuserOp,userOpHash:string,missingAccountFunds:bigint | number, chain: string = this.provider.current.id): Promise<{ tx: EthereumTxHex; output:{validationData:bigint | number}}>{
			const validateUserOp = this.abi.fn.get("validateUserOp")
			if(!validateUserOp) throw new Error("Function not defined")
			const calldata = validateUserOp.encodeWithSelector([userOp,userOpHash,missingAccountFunds]);
					this.provider.changeChain(chain);
		const tx: EthereumTxHex = hexlifyObject({
			from: msgSender,
			to: this.target,
			value: hexlify(0n),
			data: calldata
		}) as unknown as EthereumTxHex;

		const decoded = validateUserOp.decodeOutput(await this.provider.eth_call(tx))
				 const names = ["validationData"]
		 const output: {validationData:bigint | number} = Object.fromEntries(names.map((n) => [n, ""])) as unknown as {validationData:bigint | number}
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
    