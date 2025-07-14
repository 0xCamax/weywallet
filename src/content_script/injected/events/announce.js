import { EXTENSION_ID } from "../../../background/config/walletInfo.ts";
import { EVENTS } from "../../../common/constants/events.ts";
import { REQUESTS } from "../../../common/constants/requests.ts";



const announce = async () => {
  const provider = globalThis.ethereum.weyWalletProvider ?? globalThis.ethereum
  const info = await provider.request({ method: REQUESTS.PROVIDER });
  return globalThis.dispatchEvent(
    new CustomEvent(EVENTS.ANNOUNCE_PROVIDER, {
      detail: {
        info,
        provider,
        extensionId: EXTENSION_ID,
      },
    })
  );
};

globalThis.addEventListener(REQUESTS.PROVIDER, announce);

announce();
