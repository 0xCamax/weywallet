let forgeCache;

export async function getForge() {
	if (!forgeCache) {
		forgeCache = (
			await import(
				'https://esm.sh/node-forge@1.3.1?bundle&target=es2022&deno-std=0.224.0'
			)
		).default;
	}
	return forgeCache;
}

export async function digest(data: string) {
	const { sha256 } = (await getForge()).md;

	const md = sha256.create();
	md.update(data, 'utf8');
	return md;
}

export async function publicKeyFromPem(publicKeyPem: string) {
	const { publicKeyFromPem: pk2pem } = (await getForge()).pki;
	return pk2pem(publicKeyPem);
}

export async function decryptRSAKey(
	encryptedPrivateKeyPem: string,
	password: string
): Promise<any> {
	const { decryptRsaPrivateKey, privateKeyToPem } = (await getForge()).pki;
	try {
		const decryptedKey = decryptRsaPrivateKey(encryptedPrivateKeyPem, password);
		return { decryptedKey, pem: privateKeyToPem(decryptedKey) };
	} catch {
        return null
    }
}
