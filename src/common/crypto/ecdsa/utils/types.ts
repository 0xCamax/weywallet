export { type RecoveredSignature, type SigLike, type Hex } from 'https://esm.sh/@noble/secp256k1'

export type BaseJwk = {
	kty: 'EC';             // Key Type (Elliptic Curve)
	crv: string;           // Curve name (e.g., 'P-256', 'secp256k1')
	x: string;             // Base64URL-encoded X coordinate
	y: string;             // Base64URL-encoded Y coordinate
	ext?: boolean;         // Extractable (usually true)
	key_ops?: string[];    // ['sign', 'verify'], etc.
	alg?: string;          // 'ES256', 'ES256K', etc.
};

export type JwkEcPublicKey = BaseJwk & {
	use?: 'sig';           // Public key use: signature
};

export type JwkEcPrivateKey = BaseJwk & {
	d: string;             // Base64URL-encoded private key
};
