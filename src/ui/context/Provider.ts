import { createContext } from 'preact';
import { Provider } from '../../common/evm/Provider.ts';
import { CHAINS } from '../../common/constants/chains.ts';

export const ProviderContext = createContext(new Provider(CHAINS));
