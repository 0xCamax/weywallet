import * as forge from "https://esm.sh/node-forge@1.3.1"
forge.options.usePureJavacript = true
const {
	pki: {
		certificateFromAsn1,
		certificateFromPem,
		certificateToPem,
		privateKeyFromAsn1,
		decryptPrivateKeyInfo,
		publicKeyToPem,
		privateKeyToPem,
		privateKeyFromPem,
		decryptRsaPrivateKey
	},
	asn1: { fromDer },
	util: { createBuffer, bytesToHex, hexToBytes },
	md: { sha256 },
	rsa: { PublicKey, PrivateKey, setPublicKey },
} = forge.default;
const file = Deno.readFileSync("Claveprivada_FIEL_BOCA950707C51_20250529_123058.key")

const key = decipherKeyFile(file, "Alan421536")

export function decipherKeyFile(keyDer: Uint8Array, password: string) {
	const decryptedKey = decryptRsaPrivateKey(
		formatAsPem(uint8ArrayToBase64(keyDer), "ENCRYPTED PRIVATE KEY"),
		password
	);
	if (!decryptedKey)
		throw new Error('No se pudo desencriptar la clave privada.');
	return decryptedKey;
}

function formatAsPem(base64String: string, label: PemLabel) {
  const matches = base64String.match(/.{1,64}/g);
  const lines = matches ? matches.join('\n') : '';
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`;
}

function uint8ArrayToBase64(uint8Array: Uint8Array) {
  return btoa(String.fromCharCode(...uint8Array));
}

type PemLabel =
  | "CERTIFICATE"
  | "PRIVATE KEY"
  | "ENCRYPTED PRIVATE KEY"
  | "RSA PRIVATE KEY"
  | "PUBLIC KEY"
  | "CERTIFICATE REQUEST";



console.log(key)