import { createContext } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
	Portfolio as PortfolioSquema,
	Token,
	TokenData,
} from '../../common/db/squemas.ts';
import { Token as TokenContract } from '../../common/constants/contracts/Token.ts';
import { useAccount, useLocalStorage, useProvider } from './hooks/index.tsx';
import { zeroAddress } from '../../common/evm/utils/types.ts';

type PortfolioContextType = {
	trackedTokens: Token[];
	portfolio: PortfolioSquema;
	add: (tokenAddress: string, chain: string) => void;
	remove: (tokenAddress: string) => void;
	update: (_trackedTokens: Token[]) => Promise<void>;
	refToken: {
		address: '0x82B9e52b26A2954E113F94Ff26647754d5a4247D';
		name: 'MXNB';
		symbol: 'MXNB';
		decimals: 6;
	};
}

export const PortfolioContext = createContext<PortfolioContextType>({
	trackedTokens: [],
	portfolio: {},
	add: (_tokenAddress: string, _chain: string) => {},
	remove: (_tokenAddress: string) => {},
	update: (_trackedTokens: Token[]) => {
		return Promise.resolve();
	},
	refToken: {
		address: '0x82B9e52b26A2954E113F94Ff26647754d5a4247D',
		name: 'MXNB',
		symbol: 'MXNB',
		decimals: 6,
	},
});

export const Portfolio = ({
	children,
}: {
	children: preact.ComponentChildren;
}) => {
	const { account } = useAccount();
	const [trackedTokens, setTrackedTokens] = useState<Token[]>([]);
	const [portfolio, setPortfolio] = useState<PortfolioSquema>({});
	const provider = useProvider();
	const localStorage = useLocalStorage();

	const address = account?.activeAccount?.public;

	useEffect(() => {
		loadPortfolio();
	}, [account]);

	const loadPortfolio = async () => {
		const { portfolio } = (await localStorage.read('portfolio')) as {
			portfolio: PortfolioSquema;
		};
		if (portfolio) {
			setPortfolio(portfolio);
			setTrackedTokens(portfolio.trackedTokens ?? []);
		} else {
			add('0x82B9e52b26A2954E113F94Ff26647754d5a4247D', '0x66eee');
		}
	};

	const add = async (tokenAddress: string, chain: string) => {
		if (!account || !address) return;
		if (trackedTokens.some((t) => t.address === tokenAddress)) return;

		const tokenManager = new TokenContract(provider, tokenAddress);

		const newToken: Token = {
			address: tokenAddress,
			symbol: (await tokenManager.symbol(zeroAddress, chain)).output.arg5,
			name: (await tokenManager.name(zeroAddress, chain)).output.arg0,
			decimals: Number(
				(await tokenManager.decimals(zeroAddress, chain)).output.arg4
			),
			totalSupply: Number(
				(await tokenManager.totalSupply(zeroAddress, chain)).output.arg2
			),
			chain,
		};

		const updated = [...trackedTokens, newToken];
		update(updated);
		setTrackedTokens(updated);
	};

	const remove = (tokenAddress: string) => {
		if (!account || !address) return;

		const updated = trackedTokens.filter(
			(token) => token.address !== tokenAddress
		);
		update(updated);
		setTrackedTokens(updated);
	};

	const update = async (tokens: Token[]): Promise<void> => {
		if (!address || tokens.length === 0) return;

		const results = await Promise.all(
			tokens.map(async (token) => {
				const tokenManager = new TokenContract(provider, token.address);
				const balance = await tokenManager.balanceOf(
					address,
					address,
					token.chain
				);

				const data: TokenData = {
					token,
					balance: Number(balance.output.balance),
					lastUpdate: Date.now(),
				};

				return {
					address: token.address,
					data,
				};
			})
		);

		const tokenData: Record<string, TokenData> = {};
		for (const { address, data } of results) {
			tokenData[address] = data;
		}

		const portfolio: PortfolioSquema = {
			tokenData,
			trackedTokens: tokens,
		};

		await localStorage.create('portfolio', portfolio);
		setPortfolio(portfolio);
	};

	return (
		<PortfolioContext.Provider
			value={{ trackedTokens, add, remove, update, portfolio, refToken: {
		address: '0x82B9e52b26A2954E113F94Ff26647754d5a4247D',
		name: 'MXNB',
		symbol: 'MXNB',
		decimals: 6
	} }}
		>
			{children}
		</PortfolioContext.Provider>
	);
};
