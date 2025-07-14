import { decode64, encode64 } from '../../utils/codec.ts';
import { digest, publicKeyFromPem } from './utils/utils.ts';

export class Signer {
	async sign(privateKey: unknown, data: string): Promise<string> {
		return await encode64(privateKey.sign(await digest(data)));
	}

	async verify(
		publicKeyPem: string,
		data: string,
		signatureB64: string
	): Promise<boolean> {
		const pubKey = await publicKeyFromPem(publicKeyPem);
		const md = (await digest(data)).digest().bytes();
		return pubKey.verify(md, await decode64(signatureB64));
	}

	async encrypt(publicKeyPem: string, message: string): Promise<string> {
		const pubKey = await publicKeyFromPem(publicKeyPem);
		return await encode64(pubKey.encrypt(message, 'RSAES-PKCS1-V1_5'));
	}

	async decrypt(privateKey: unknown, ciphertextB64: string): Promise<string> {
		const cipher = await decode64(ciphertextB64)
		return (privateKey.decrypt(cipher, 'RSAES-PKCS1-V1_5'))
	}
}

export const RSASigner = new Signer();
