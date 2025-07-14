export function formatEtherFromBytes32(bytes32: string) {
	if (typeof bytes32 !== 'string' || !bytes32.startsWith('0x')) {
		throw new Error('Invalid bytes32 input');
	}

	const wei = BigInt(bytes32);
	const weiStr = wei.toString().padStart(19, '0');
	const intPart = weiStr.slice(0, weiStr.length - 18);
	const decPart = weiStr.slice(weiStr.length - 18).padEnd(18, '0');
	const trimmedDec = decPart.slice(0, 8).replace(/0+$/, '');

	return trimmedDec.length > 0 ? `${intPart}.${trimmedDec}` : intPart;
}

export function floatToHex(value: number) {
	return '0x' + (value * 1e18).toString(16);
}

export function bytes32ToFloat(bytes32: string): number {
    return parseFloat(formatEtherFromBytes32(bytes32))
}
