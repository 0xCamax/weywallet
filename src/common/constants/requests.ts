export const REQUESTS = {
  PROVIDER: "eip6963:requestProvider",
  ACCOUNTS: "eth_accounts",
  ACCOUNTS2: "eth_requestAccounts",
  UPGRADE: "upgrade",
  RSA_SIGN: "rsa_signatureRequest",
  ECDSA_SIGN: "ecdsa_signatureRequest",
  ETH_SIGN: "eth_sign",
  ETH_SEND: "eth_sendTransaction",
  PERSONAL_SIGN: "personal_sign",
  SIGN_TYPED_V1: "eth_signTypedData_v1",
  SIGN_TYPED_V3: "eth_signTypedData_v3",
  SIGN_TYPED_V4: "eth_signTypedData_v4",
  SEND_RAW_TX: "eth_sendRawTransaction",
  ACTION: "model_action"
} as const;