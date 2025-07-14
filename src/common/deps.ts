import { utils, etc, getPublicKey, sign, verify } from '@noble/secp256k1';
import { hmac } from '@noble/hashes/hmac';
import { keccak_256 } from '@noble/hashes/sha3';
import { RLP } from '@ethereumjs/rlp';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes, concatBytes } from 'ethereum-cryptography/utils';
export { getPublicKey, sign, verify };
export const { randomPrivateKey } = utils;
export const { bytesToHex: uint8ArrayToHex, hexToBytes: hexToUint8Array } = etc;


// Ethereum
export { RLP, keccak256, utf8ToBytes, concatBytes };

// Extend `etc` for a keccak256-based HMAC
etc.hmacSha256Sync = (
	key: string | Uint8Array,
	...msgs: Uint8Array[]
): Uint8Array => hmac(keccak_256, key, concatBytes(...msgs));

export const { subtle } = crypto




