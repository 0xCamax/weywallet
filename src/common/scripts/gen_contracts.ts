import { genContractClass } from "../gen/contracts.ts";
import { erc20Abi } from "../constants/abis/ERC20.ts";
import { ChainlinkSmartAccounts } from "../constants/abis/ChainlinkSmartAccount.ts";

genContractClass(erc20Abi, "Token")
genContractClass(ChainlinkSmartAccounts, "ChainlinkAccount")