import { RSASigner } from '../../common/crypto/rsa/Signer.ts';
import { encode64, decode64 } from '../../common/utils/codec.ts';
import { AccountSessionPayload, JwtHeader } from '../../common/db/squemas.ts';

export async function createJWT(
	payload: AccountSessionPayload,
	privateKey: unknown
): Promise<string> {
	const header: JwtHeader = { alg: 'RS256', typ: 'JWT' };

	const encodedHeader = await encode64(JSON.stringify(header));
	const encodedPayload = await encode64(JSON.stringify(payload));

	const data = `${encodedHeader}.${encodedPayload}`;
	const encodedSignature = await RSASigner.sign(privateKey, data);
	return `${data}.${encodedSignature}`;
}

export async function verifyJWT(
	token: string
): Promise<AccountSessionPayload | null> {
	const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
	if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

	const data = `${encodedHeader}.${encodedPayload}`;

	const payload = JSON.parse(
		await decode64(encodedPayload)
	) as AccountSessionPayload;
	const publicKeyPem = payload.publicKey;

	const isValid = await RSASigner.verify(publicKeyPem, data, encodedSignature);

	if (!isValid) return null;

	const now = Math.floor(Date.now() / 1000);
	if (payload.exp < now) return null;

	return payload;
}


