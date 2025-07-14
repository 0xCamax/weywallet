const env = "test"


export const PECTRA_CHAINS = [
	{
		id: '0xa4b1',
		name: 'Arbitrum One',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrl: 'https://arb1.arbitrum.io/rpc',
	},
	{
		id: '0x2105',
		name: 'Base',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrl: 'https://mainnet.base.org',
	},
	{
		id: '0x1',
		name: 'Ethereum',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrl: 'https://eth.merkle.io',
	},
	{
		id: '0x38',
		name: 'BNB Smart Chain',
		nativeCurrency: { decimals: 18, name: 'BNB', symbol: 'BNB' },
		rpcUrl: 'https://56.rpc.thirdweb.com',
	},
	{
		id: '0xa',
		name: 'OP Mainnet',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrl: 'https://mainnet.optimism.io',
	},
	{
		id: '0xa4ec',
		name: 'Celo',
		nativeCurrency: { decimals: 18, name: 'CELO', symbol: 'CELO' },
		rpcUrl: 'https://forno.celo.org',
	},
	{
		id: '0x64',
		name: 'Gnosis',
		nativeCurrency: { decimals: 18, name: 'xDAI', symbol: 'XDAI' },
		rpcUrl: 'https://rpc.gnosischain.com',
	},
];

export const TEST_CHAINS = [
	{
		id: '0x66eee',
		name: 'Arbitrum Sepolia',
		nativeCurrency: {
			name: 'Arbitrum Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
	},
	{
		id: '0x14a34',
		name: 'Base Sepolia',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrl: 'https://sepolia.base.org',
	},
	{
		id: '0xaa36a7',
		name: 'Sepolia',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrl: 'https://sepolia.drpc.org',
	},
	{
		id: '0xaa37dc',
		name: 'OP Sepolia',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrl: 'https://sepolia.optimism.io',
	}
];

export const CHAINS = env == "test" ? TEST_CHAINS : [
	{
		id: '0xa4b1',
		name: 'Arbitrum',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrl: 'https://arb1.arbitrum.io/rpc',
		tokens: {
			link: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
		},
		contracts: {
			CCIPDirectory: {
				router: '0x141fa059441E0ca23ce184B6A78bafD2A517DdE8',
			},
			AutomationDirectory: {
				registry: '0x37D9dC70bfcd8BC77Ec2858836B923c560E891D1',
				registrar: '0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad',
			},
		},
	},
	{
		id: '0x2105',
		name: 'Base',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrl: 'https://mainnet.base.org',
		tokens: {
			link: '0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196',
		},
		contracts: {
			CCIPDirectory: {
				router: '0x881e3A65B4d4a04dD529061dd0071cf975F58bCD',
			},
			AutomationDirectory: {
				registry: '0xf4bAb6A129164aBa9B113cB96BA4266dF49f8743',
				registrar: '0xE28Adc50c7551CFf69FCF32D45d037e5F6554264',
			},
		},
	},
	{
		id: '0xa',
		name: 'OP Mainnet',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrl: 'https://mainnet.optimism.io',
		tokens: {
			link: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6',
			WETH: '0x4200000000000000000000000000000000000006',
		},
		contracts: {
			CCIPDirectory: {
				router: '0x3206695CaE29952f4b0c22a169725a865bc8Ce0f',
			},
			AutomationDirectory: {
				registry: '0x4F70c323b8B72AeffAF633Aa4D5e8B6Be5df4AEf',
				registrar: '0xe96057F85510292231e2C759752f012C87A8c8dd',
			},
		},
	},
];

const default_chain = env == "test" ? "0x14a34" : "0x2105"
export const DEFAULT_CHAIN = CHAINS.find((c) => c.id == default_chain) ?? {
	name: 'base',
	id: '0x2105',
	rpcUrl: 'https://mainnet.base.org',
};
