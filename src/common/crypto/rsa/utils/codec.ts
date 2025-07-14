type PemLabel =
	| 'CERTIFICATE'
	| 'PRIVATE KEY'
	| 'ENCRYPTED PRIVATE KEY'
	| 'RSA PRIVATE KEY'
	| 'PUBLIC KEY'
	| 'CERTIFICATE REQUEST';

export function pemToUint8Array(pem: string): Uint8Array {
	return derToUint8Array(pemToDer(pem));
}

export function publicKeyPemToHex(pem: string): string {
	const base64 = pem
		.replace('-----BEGIN PUBLIC KEY-----', '')
		.replace('-----END PUBLIC KEY-----', '')
		.replace(/\s/g, '');
	const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	return [...binary].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function formatAsPem(base64String: string, label: PemLabel) {
	const matches = base64String.match(/.{1,64}/g);
	const lines = matches ? matches.join('\n') : '';
	return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`;
}

export function pemToDer(pem: string): string {
	const base64 = pem
		.replace(/-----BEGIN [^-]+-----/, '')
		.replace(/-----END [^-]+-----/, '')
		.replace(/\s+/g, '');
	return base64;
}

export function derToUint8Array(derBase64: string): Uint8Array {
	const binary = atob(derBase64);
	const der = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		der[i] = binary.charCodeAt(i);
	}
	return der;
}
