import { DEFAULT_CHAIN } from "../constants/chains.ts";


export class EVM extends EventTarget {
  constructor(url, chain) {
    super();
    this.url = url;
    this.chain = chain;
    this.id = 0;
  }

  setProvider(url, chain) {
    this.url = url;
    this.chain = chain;
  }

  on(event, handler) {
    this.addEventListener(event, handler);
  }

  off(event, handler) {
    this.removeEventListener(event, handler);
  }

  emit(event, detail) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }

  setSensitiveRequestHandler(handler) {
    this.onSensitiveRequest = handler;
  }

  async request(method, params = []) {
    // if (sensitiveMethods.has(method)) {
    //   if (!this.onSensitiveRequest) {
    //     throw new Error(
    //       `Sensitive method "${method}" called but no handler set`
    //     );
    //   }
    //   return await this.onSensitiveRequest(method, params);
    // }

    const body = {
      jsonrpc: "2.0",
      method,
      params,
      id: this.id++,
    };

    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (json.error) {
      throw new Error(`[${json.error.code}] ${json.error.message}`);
    }

    return json.result;
  }

  web3_sha3(data) {
    return this.request("web3_sha3", [data]);
  }

  net_version() {
    return this.request("net_version");
  }
  net_listening() {
    return this.request("net_listening");
  }
  net_peerCount() {
    return this.request("net_peerCount");
  }

  eth_protocolVersion() {
    return this.request("eth_protocolVersion");
  }
  eth_syncing() {
    return this.request("eth_syncing");
  }
  eth_coinbase() {
    return this.request("eth_coinbase");
  }
  eth_mining() {
    return this.request("eth_mining");
  }
  eth_hashrate() {
    return this.request("eth_hashrate");
  }
  eth_gasPrice() {
    return this.request("eth_gasPrice");
  }
  eth_accounts() {
    return this.request("eth_accounts");
  }
  eth_blockNumber() {
    return this.request("eth_blockNumber");
  }

  eth_getBalance(address, block = "latest") {
    return this.request("eth_getBalance", [address, block]);
  }

  eth_getStorageAt(address, position, block = "latest") {
    return this.request("eth_getStorageAt", [address, position, block]);
  }

  eth_getTransactionCount(address, block = "latest") {
    return this.request("eth_getTransactionCount", [address, block]);
  }

  eth_getBlockTransactionCountByHash(hash) {
    return this.request("eth_getBlockTransactionCountByHash", [hash]);
  }

  eth_getBlockTransactionCountByNumber(number) {
    return this.request("eth_getBlockTransactionCountByNumber", [number]);
  }

  eth_getCode(address, block = "latest") {
    return this.request("eth_getCode", [address, block]);
  }

  eth_sendRawTransaction(signedTx) {
    return this.request("eth_sendRawTransaction", [signedTx]);
  }

  eth_call(callObject, block = "latest") {
    return this.request("eth_call", [callObject, block]);
  }

  eth_estimateGas(txObject) {
    return this.request("eth_estimateGas", [txObject]);
  }
  eth_feeHistory(blockCount = "0xa", block = "latest", percetil = [50]) {
    return this.request("eth_feeHistory", [blockCount, block, percetil]);
  }

  eth_getBlockByHash(hash, full = false) {
    return this.request("eth_getBlockByHash", [hash, full]);
  }

  eth_getBlockByNumber(number, full = false) {
    return this.request("eth_getBlockByNumber", [number, full]);
  }

  eth_getTransactionByHash(hash) {
    return this.request("eth_getTransactionByHash", [hash]);
  }

  eth_getTransactionByBlockHashAndIndex(hash, index) {
    return this.request("eth_getTransactionByBlockHashAndIndex", [hash, index]);
  }

  eth_getTransactionByBlockNumberAndIndex(number, index) {
    return this.request("eth_getTransactionByBlockNumberAndIndex", [
      number,
      index,
    ]);
  }

  eth_getTransactionReceipt(hash) {
    return this.request("eth_getTransactionReceipt", [hash]);
  }

  eth_getLogs(filter) {
    return this.request("eth_getLogs", [filter]);
  }

  eth_newFilter(filter) {
    return this.request("eth_newFilter", [filter]);
  }

  eth_newBlockFilter() {
    return this.request("eth_newBlockFilter");
  }

  eth_newPendingTransactionFilter() {
    return this.request("eth_newPendingTransactionFilter");
  }

  eth_uninstallFilter(id) {
    return this.request("eth_uninstallFilter", [id]);
  }

  eth_getFilterChanges(id) {
    return this.request("eth_getFilterChanges", [id]);
  }

  eth_getFilterLogs(id) {
    return this.request("eth_getFilterLogs", [id]);
  }

  eth_createAccessList(tx, blocktag = "latest") {
    return this.request("eth_createAccessList", [tx, blocktag]);
  }

  async populateTransaction(tx, address) {
    let gasParams;
    const type = tx.type ?? "0x0";
    tx.from = address;
    console.log(tx)

    if (type === "0x0" || type === "0x1") {
      const { gasLimit, gasPrice } = await this.estimateGas(tx);
      gasParams = { gasLimit, gasPrice };
    } else if (type === "0x2") {
      tx.accessList = await this.eth_createAccessList(tx);
    } else {
      const { gasLimit, maxFeePerGas, maxPriorityFeePerGas } =
        await this.estimateGas(tx);
      gasParams = { gasLimit, maxFeePerGas, maxPriorityFeePerGas };
    }

    const nonce = await this.eth_getTransactionCount(address);
    return {
      ...tx,
      ...gasParams,
      nonce,
    };
  }

  async estimateGas(tx) {
    const gasLimitHex = await this.eth_estimateGas(tx);
    let gasLimitNum = BigInt(gasLimitHex);

    gasLimitNum = gasLimitNum + gasLimitNum / 5n;

    let maxFeePerGas, maxPriorityFeePerGas, gasPrice;

    try {
      const fee = await this.eth_feeHistory();

      const baseFee =
        fee && fee.baseFeePerGas && fee.baseFeePerGas.length > 0
          ? BigInt(fee.baseFeePerGas[0])
          : 0n;

      const priorityFee =
        fee && fee.reward && fee.reward.length > 0 && fee.reward[0].length > 0
          ? BigInt(fee.reward[0][0])
          : 1500000000n;

      gasPrice = await this.eth_gasPrice();
      maxPriorityFeePerGas = "0x" + priorityFee.toString(16);
      maxFeePerGas = "0x" + (baseFee + priorityFee * 2n).toString(16);
    } catch {
      const gasPriceHex = await this.eth_gasPrice();
      maxFeePerGas = gasPriceHex;
      maxPriorityFeePerGas = "0x59682f00"; // fallback priority fee
    }

    return {
      gasPrice,
      gasLimit: "0x" + gasLimitNum.toString(16),
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }
}

export const evm = new EVM(DEFAULT_CHAIN.rpcUrl, DEFAULT_CHAIN.id);
