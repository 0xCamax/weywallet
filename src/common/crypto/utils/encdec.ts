export async function encrypt(
	data: object,
	password: string
): Promise<{ iv: Uint8Array; salt: Uint8Array; ciphertext: Uint8Array }> {
	const enc = new TextEncoder();
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const salt = crypto.getRandomValues(new Uint8Array(16));

	const keyMaterial = await getKeyMaterial(password);
	const key = await deriveKey(keyMaterial, salt);

	const encodeddata = enc.encode(JSON.stringify(data));
	const ciphertext = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		key,
		encodeddata
	);

	const encrypted = {
		iv,
		salt,
		ciphertext: new Uint8Array(ciphertext),
	};

	return encrypted;
}

async function getKeyMaterial(password: string) {
	const enc = new TextEncoder();
	return await crypto.subtle.importKey(
		'raw',
		enc.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	);
}

async function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array) {
	return await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100_000,
			hash: 'SHA-256',
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

export async function decrypt(
	encrypted: { ciphertext: Uint8Array; iv: Uint8Array; salt: Uint8Array },
	password: string
): Promise<object> {
	try {
		const dec = new TextDecoder();
		const { iv, salt, ciphertext } = encrypted;
		const keyMaterial = await getKeyMaterial(password);
		const key = await deriveKey(keyMaterial, salt);

		const plainBuffer = await crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv },
			key,
			ciphertext
		);

		return JSON.parse(dec.decode(plainBuffer));
	} catch (error) {
		console.log(error)
		return {}
	}
}
