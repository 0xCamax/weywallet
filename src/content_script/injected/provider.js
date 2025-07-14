import { Mailbox } from "../../common/mailbox/Mailbox.ts";

const provider = new Mailbox("DOM");

if (window.ethereum) {
  window.ethereum.isWeyWallet = true;
  window.ethereum.weyWalletProvider = {
    ...provider,
    request: (args) =>
      provider.request(
        "WALLET",
        { method: args.method, params: args.params },
        "CONTENT SCRIPT"
      ),
    on: (name, handler) => provider.on(name, handler),
    removeListener: (name) => provider.off(name),
  };
} else {
  window.ethereum = {
    isWeyWallet: true,
    ...provider,
    request: (args) =>
      provider.request(
        "WALLET",
        { method: args.method, params: args.params },
        "CONTENT SCRIPT"
      ),
    on: (name, handler) => provider.on(name, handler),
    removeListener: (name) => provider.off(name),
  };
}
