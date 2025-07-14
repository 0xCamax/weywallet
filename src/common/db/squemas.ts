export type Token = {
	chain: string;
	name: string;
	symbol: string;
	decimals: number;
	totalSupply: number;
	address: string;
};

export type TokenData = {
	token: Token;
	balance: number;
	lastUpdate: number;
};

export type Account = {
	type: AccountType;
	userName: string;
	efirma: Efirma;
	activeAccount: Key;
	keys: Key[];
};

export type Vault = {
	[key: string]: Encrypted;
};

export type Key = {
	type: SupportedAlgorithms;
	public: string;
	tag: string;
	ensName: string;
	signatureHistory: SignatureResult[];
	pendingSignatures: SignatureRequest[];
};

export type Portfolio = {
	tokenData?: Record<string, TokenData>;
	trackedTokens?: Token[];
};

export type Encrypted = {
	encrypted: string;
	iv: string;
	salt: string;
};

export type Efirma = {
	certificate: CertInfo;
	privateKey: {
		pem: string;
		der: string;
		encrypted?: boolean;
	};
	signatureHistory: SignatureResult[];
	pendingSignatures: SignatureRequest[];
};

export type SignatureRequest = {
	type: PayloadType;
	sender: string;
	payload: unknown;
	timestamp?: string;
};

export type SignatureResult = {
	version: string;
	signedTarget: SignatureRequest;
	signature: {
		algorithm: SupportedAlgorithms;
		format: SupportedSigFormats;
		signedAt: string;
		value: {
			encoding: 'base64' | 'hex' | 'raw';
			content: string;
		};
		byteRange?: [number, number, number, number];
	};
};

export type CertInfo = {
	subject: Subject;
	publicKey: {
		pem: string;
		der: string;
	};
	serialNumber: string;
	issuer: Issuer;
	validity: {
		notBefore: string;
		notAfter: string;
	};
	extensions: {
		keyUsage: {
			dataEncipherment: boolean;
			digitalSignature: boolean;
			keyAgreement: boolean;
			keyEncipherment: boolean;
			nonRepudiation: boolean;
		};
	};
	pem: string;
};

export type Subject = {
	commonName: string;
	organizationName: string;
	countryName: string;
	emailAddress: string;
	RFC: string;
	CURP: string;
};

export type Issuer = {
	commonName: string;
	organizationName: string;
	organizationalUnitName: string;
	emailAddress: string;
	streetAddress: string;
	postalCode: string;
	countryName: string;
	stateOrProvinceName: string;
	localityName: string;
	RFC: string;
	unstructuredName: string;
};

export type AccountType = 'free' | 'premium';
export type SupportedAlgorithms =
	| 'RSASSA-PKCS1-v1_5'
	| 'ECDSA-secp256k1'
	| 'EdDSA-ed25519'
	| 'HS256'
	| 'RS256';
export type SupportedSigFormats = 'raw' | 'PKCS7' | 'eip191' | 'eip712';

export type PayloadType =
	| 'document' // archivo físico (PDF, XML, etc.)
	| 'ethereum-tx' // raw Ethereum transaction
	| 'eip712' // TypedData (EIP-712)
	| 'message' // texto plano (string)

export type AccountSessionPayload = {
	iss: string;
	sub: string;
	publicKey: string;
	iat: number;
	exp: number;
	accountType: AccountType;
};

export interface JwtHeader {
	alg: SupportedAlgorithms;
	typ?: 'JWT';
}
