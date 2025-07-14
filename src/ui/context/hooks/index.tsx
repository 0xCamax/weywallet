import { useContext } from 'preact/hooks';
import { RouterContext } from '../Router.tsx';
import { ThemeContext } from '../Theme.tsx';
import { LocalStorage } from '../LocalStorage.ts';
import { SessionStorage } from '../SessionStorage.ts';
import { ProviderContext } from "../Provider.ts"
import { MailboxContext } from "../Mailbox.tsx";
import { AccountManagerContext } from "../AccountManager.ts";
import { PortfolioContext } from "../Portfolio.tsx";
import { AccountsContext } from "../Account.tsx";
import { dbContext } from "../db.ts";

export const useRouter = () => useContext(RouterContext);
export const useTheme = () => useContext(ThemeContext);
export const useLocalStorage = () => useContext(LocalStorage);
export const useSessionStorage = () => useContext(SessionStorage);
export const useProvider = () => useContext(ProviderContext)
export const useMailbox = () => useContext(MailboxContext)
export const useAccountManager = () => useContext(AccountManagerContext)
export const usePortfolio = () => useContext(PortfolioContext);
export const useAccount = () => useContext(AccountsContext)
export const useDb = () => useContext(dbContext)