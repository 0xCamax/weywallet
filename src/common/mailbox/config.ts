import { REQUESTS } from "../constants/requests.ts";


export const sensitiveMethods = new Set<string>([
  REQUESTS.ACCOUNTS2,
  REQUESTS.ACCOUNTS,
  REQUESTS.ETH_SIGN,
  REQUESTS.PERSONAL_SIGN,
  REQUESTS.SEND_RAW_TX,
  REQUESTS.SIGN_TYPED_V1,
  REQUESTS.SIGN_TYPED_V3,
  REQUESTS.SIGN_TYPED_V4,
  REQUESTS.RSA_SIGN,
  REQUESTS.ECDSA_SIGN,
  REQUESTS.UPGRADE,
  REQUESTS.PROVIDER,
  REQUESTS.ETH_SEND
]);

export const nonSensitiveMethods = new Set([
  // Información del cliente
  "web3_clientVersion",
  "web3_sha3",

  // Ethereum chain
  "net_version",
  "net_listening",
  "net_peerCount",

  // Estado del nodo
  "eth_protocolVersion",
  "eth_syncing",
  "eth_coinbase",
  "eth_blockNumber",
  "eth_gasPrice",
  "eth_getBalance",
  "eth_getStorageAt",
  "eth_getTransactionCount",
  "eth_getBlockTransactionCountByHash",
  "eth_getBlockTransactionCountByNumber",
  "eth_getUncleCountByBlockHash",
  "eth_getUncleCountByBlockNumber",
  "eth_getCode",
  "eth_getBlockByHash",
  "eth_getBlockByNumber",
  "eth_getTransactionByHash",
  "eth_getTransactionByBlockHashAndIndex",
  "eth_getTransactionByBlockNumberAndIndex",
  "eth_getTransactionReceipt",
  "eth_getUncleByBlockHashAndIndex",
  "eth_getUncleByBlockNumberAndIndex",
  "eth_call",
  "eth_estimateGas",
  "eth_chainId",

  // Logs y eventos
  "eth_getLogs",
  "eth_getFilterChanges",
  "eth_getFilterLogs",
  "eth_newFilter",
  "eth_newBlockFilter",
  "eth_newPendingTransactionFilter",
  "eth_uninstallFilter",

  // Otros
  "eth_feeHistory",
  "eth_maxPriorityFeePerGas",

  // EIP-1898 (bloques históricos con timestamp)
  "eth_getBlockByTimestamp",

  // Soporte EIP-4844 (blobs y datos extendidos)
  "eth_getBlob",
  "eth_getBlobSidecars",

  // Watchers / suscripción (usualmente limitado en extensions)
  "eth_subscribe",
  "eth_unsubscribe",

  // RPC internas de Geth / Parity / Erigon / Nethermind
  "parity_netPeers",
  "parity_chainStatus",
  "parity_pendingTransactions",
  "erigon_getHeaderByNumber",
  "erigon_getHeaderByHash"
]);
