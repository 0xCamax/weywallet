import {
	Efirma,
	CertInfo,
	Issuer,
	Subject,
	Key,
	Account,
} from '../../common/db/squemas.ts';
import { randomPrivateKey } from '../../common/deps.ts';
import { getAddress } from '../../common/utils/codec.ts';

export function generateMockEfirma(): Efirma {
	const mockSubject: Subject = {
		commonName: 'Juan Pérez',
		organizationName: 'Ejemplo S.A. de C.V.',
		countryName: 'MX',
		emailAddress: 'juan.perez@example.com',
		RFC: 'JUAP800101ABC',
		CURP: 'JUAP800101HDFRRN09',
	};

	const mockIssuer: Issuer = {
		commonName: 'SAT',
		organizationName: 'Servicio de Administración Tributaria',
		organizationalUnitName: 'Unidad de Certificación',
		emailAddress: 'certificados@sat.gob.mx',
		streetAddress: 'Av. Hidalgo 77',
		postalCode: '06000',
		countryName: 'MX',
		stateOrProvinceName: 'Ciudad de México',
		localityName: 'Centro',
		RFC: 'SAT970701NN3',
		unstructuredName: 'Autoridad Certificadora SAT',
	};

	const mockCert: CertInfo = {
		subject: mockSubject,
		publicKey: {
			pem: '-----BEGIN PUBLIC KEY-----\nFAKEPUBLICKEYBASE64==\n-----END PUBLIC KEY-----',
			der: 'FAKE_PUBLIC_KEY_DER_BASE64==',
		},
		serialNumber: '1234567890ABCDEF',
		issuer: mockIssuer,
		validity: {
			notBefore: '2025-01-01T00:00:00Z',
			notAfter: '2026-01-01T00:00:00Z',
		},
		extensions: {
			keyUsage: {
				dataEncipherment: false,
				digitalSignature: true,

				keyAgreement: false,

				keyEncipherment: true,
				nonRepudiation: true,
			},
		},
		pem: '-----BEGIN CERTIFICATE-----\nFAKEPUBLICKEYBASE64==\n-----END CERTIFICATE-----',
	};

	const efirmaMock: Efirma = {
		certificate: mockCert,
		privateKey: {
			pem: '-----BEGIN PRIVATE KEY-----\nFAKEPRIVATEKEYBASE64==\n-----END PRIVATE KEY-----',
			der: 'FAKE_PRIVATE_KEY_DER_BASE64==',
		},
		signatureHistory: [],
		pendingSignatures: [],
	};

	return efirmaMock;
}

export function createGuestAccount(): Account {
	const guestNames = [
		'Kiko',
		'Chavo',
		'Don Ramon',
		'Doña Clotilde',
		'Chilindrina',
	];
	const key = randomPrivateKey();
	const address = getAddress(key as unknown as string);

	const newKey = {
		type: 'ECDSA-secp256k1',
		tag: `Key 1`,
		public: address,
	} as Key;

	return {
		activeAccount: newKey,
		keys: [newKey],
		efirma: generateMockEfirma(),
		type: 'free',
		userName:
			guestNames[Math.floor(Math.random() * guestNames.length)] +
			`_${crypto.randomUUID().slice(0, 8)}`,
	};
}
