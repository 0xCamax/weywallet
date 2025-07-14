import { createContext } from "preact";
import { Account } from "../../common/evm/Account.ts";
import { CHAINS } from "../../common/constants/chains.ts";

export const AccountManagerContext = createContext(new Account(CHAINS))