import {
	getPublicKey,
	uint8ArrayToHex,
} from '../../../deps.ts';

export function publicKeyFromPrivateKey(key: string) {
	return getPublicKey(key, false).slice(1);
}

export function privateKeyToHex(key: Uint8Array): string {
	return uint8ArrayToHex(key);
}



export const base64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
