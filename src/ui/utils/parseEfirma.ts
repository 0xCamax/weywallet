import { formatAsPem, pemToDer } from '../../common/crypto/rsa/utils/codec.ts';
import { CertInfo, Issuer, Subject } from '../../common/db/squemas.ts';
import { uint8ArrayToBase64 } from '../../common/utils/codec.ts';

export async function parseEfirma(certFile: File, keyFile: File) {
	const [keyBuffer, certBuffer] = await Promise.all([
		keyFile.arrayBuffer(),
		certFile.arrayBuffer(),
	]);

	const keyBytes = new Uint8Array(keyBuffer);
	const certBytes = new Uint8Array(certBuffer);

	const {
		pki: { certificateFromPem, publicKeyToPem },
	} = (
		await import(
			'https://esm.sh/node-forge@1.3.1?bundle&target=es2022&deno-std=0.224.0'
		)
	).default;

	const encryptedPrivateKeyPem = formatAsPem(
		uint8ArrayToBase64(keyBytes),
		'ENCRYPTED PRIVATE KEY'
	);

	const certPem = formatAsPem(uint8ArrayToBase64(certBytes), 'CERTIFICATE');
	const cert = certificateFromPem(certPem);

	const keyUsage = cert.extensions.find((ext) => ext.name === 'keyUsage');
	const { issuer, subject, serialNumber, validity, publicKey } = cert;

	const {
		digitalSignature,
		nonRepudiation,
		keyEncipherment,
		dataEncipherment,
		keyAgreement,
	} = keyUsage || {};

	const toRecord = (attributes: { name?: string; value: string }[]) =>
		Object.fromEntries(
			attributes.map(({ name, value }) => [name ?? 'RFC', value])
		);

	const certInfo: CertInfo = {
		publicKey: {
			pem: publicKeyToPem(publicKey),
			der: pemToDer(publicKeyToPem(publicKey)),
		},
		serialNumber,
		issuer: toRecord(issuer.attributes) as Issuer,
		subject: toRecord(subject.attributes) as Subject,
		validity,
		extensions: {
			keyUsage: {
				digitalSignature,
				nonRepudiation,
				keyEncipherment,
				dataEncipherment,
				keyAgreement,
			},
		},
		pem: certPem,
	};

	return {
		certInfo,
		privateKey: {
			pem: encryptedPrivateKeyPem,
			der: pemToDer(encryptedPrivateKeyPem),
		},
	};
}
