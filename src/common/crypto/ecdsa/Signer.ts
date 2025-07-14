import { RecoveredSignature, SigLike, Hex } from './utils/types.ts';
import {
	getPublicKey,
	verify as v,
	sign as s,
	uint8ArrayToHex,
	keccak256,
} from '../../deps.ts';
import { base64url } from './utils/codec.ts';

export class Signer {
	sign(digest: Uint8Array, key: Uint8Array): RecoveredSignature {
		return s(digest, key);
	}
	verify(
		signature: SigLike | Hex,
		message: Hex,
		key: Uint8Array
	): { valid: boolean; address: string } {
		const pub64 = this.publicKeyFromPrivateKey(key);
		const publicKeyFull = new Uint8Array(65);
		publicKeyFull[0] = 0x04;
		publicKeyFull.set(pub64, 1);
		const valid = v(signature, message, publicKeyFull);
		const address = '0x' + uint8ArrayToHex(keccak256(pub64).slice(-20));

		return { valid, address };
	}

	protected publicKeyFromPrivateKey(key: Uint8Array) {
		return getPublicKey(key, false).slice(1);
	}

	jwk(key: Uint8Array) {
		const uncompressed = getPublicKey(key, false).slice(1);
		const x = uncompressed.slice(1, 33);
		const y = uncompressed.slice(33, 65);

		return {
			kty: 'EC',
			crv: 'secp256k1',
			x: base64url(x),
			y: base64url(y),
			d: base64url(key),
			ext: true,
			key_ops: ['sign', 'verify'],
		};
	}
}
