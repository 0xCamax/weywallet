import { CHAINS } from '../../common/constants/chains.ts';
import { Provider } from '../../common/evm/Provider.ts';


export const provider = new Provider(CHAINS);

export async function handleRpcRequest({ method, params }) {
  switch (method) {
    case 'eth_blockNumber':
      return await provider.eth_blockNumber();

    case 'eth_chainId':
      return  provider.current.id;

    case 'eth_getBalance':
      return await provider.eth_getBalance(params[0]);

    case 'eth_getTransactionCount':
      return await provider.eth_getTransactionCount(params[0]);

    case 'eth_getCode':
      return await provider.eth_getCode(params[0]);

    case 'eth_getStorageAt':
      return await provider.eth_getStorageAt(params[0], params[1]);

    case 'eth_getBlockByNumber':
      return await provider.eth_getBlockByNumber(params[0]);

    case 'eth_getTransactionByHash':
      return await provider.eth_getTransactionByHash(params[0]);

    case 'eth_getTransactionReceipt':
      return await provider.eth_getTransactionReceipt(params[0]);

    case 'eth_getLogs':
      return await provider.eth_getLogs(params[0]);

    case 'eth_estimateGas':
      return await provider.eth_estimateGas(params[0]);

    case 'eth_call':
      return await provider.eth_call(params[0]);

    case 'eth_feeHistory':
      return await provider.eth_feeHistory(params[0], params[1]);

    default:
      throw new Error(`Method ${method} is recognized but not implemented.`);
  }
}

export async function signatureApproval(req){
  console.log(req)
  const response = await mailbox.request("SIGNATURE", req, "EXTENSION")
  chrome.sidePanel.open({
    tabId: await getCurrentTab()
  })

}
