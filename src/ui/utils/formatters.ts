// Money formatting utilities for crypto/token amounts

type NumericValue = number | string | bigint;

interface SmartFormatOptions {
	decimals?: number | 'auto';
	compact?: boolean;
	prefix?: string;
	suffix?: string;
	minDecimals?: number;
	maxDecimals?: number;
	decimalsFromValue?: number;
}

interface TimeFormatOptions {
	style?: 'relative' | 'absolute' | 'full';
	showSeconds?: boolean;
	locale?: string;
}

/**
 * Format large numbers with K, M, B, T suffixes
 */
export function formatLargeNumber(value: NumericValue, decimals: number = 2): string {
	const num = typeof value === 'bigint' ? Number(value) : Number(value);
	
	if (isNaN(num) || num === 0) return '0';
	
	const abs = Math.abs(num);
	const sign = num < 0 ? '-' : '';
	
	if (abs >= 1e12) return sign + (abs / 1e12).toFixed(decimals) + 'T';
	if (abs >= 1e9) return sign + (abs / 1e9).toFixed(decimals) + 'B';
	if (abs >= 1e6) return sign + (abs / 1e6).toFixed(decimals) + 'M';
	if (abs >= 1e3) return sign + (abs / 1e3).toFixed(decimals) + 'K';
	
	return sign + abs.toFixed(decimals);
}

/**
 * Format token balance with proper decimal handling
 */
export function formatTokenBalance(
	balance: NumericValue, 
	decimals: NumericValue, 
	displayDecimals: number = 4
): string {
	const balanceNum = typeof balance === 'bigint' ? Number(balance) : Number(balance);
	const decimalsNum = typeof decimals === 'bigint' ? Number(decimals) : Number(decimals);
	
	if (isNaN(balanceNum) || isNaN(decimalsNum)) return '0';
	
	const actualBalance = balanceNum / Math.pow(10, decimalsNum);
	
	// For very small amounts, show more precision
	if (actualBalance < 0.0001 && actualBalance > 0) {
		return actualBalance.toExponential(2);
	}
	
	// For amounts less than 1, show up to 6 decimals
	if (actualBalance < 1) {
		return actualBalance.toFixed(6).replace(/\.?0+$/, '');
	}
	
	return actualBalance.toFixed(displayDecimals).replace(/\.?0+$/, '');
}

/**
 * Format USD currency values
 */
export function formatMoney(value: NumericValue, decimals: number, compact: boolean = false): string {
	const num = Number(formatTokenBalance(value, decimals));
	
	if (isNaN(num)) return '$0.00';
	
	if (compact && Math.abs(num) >= 1_000_000) {
		return '$' + formatLargeNumber(num, 0);
	}
	
	return new Intl.NumberFormat("es-MX", {
		style: 'currency',
		currency: "MXN",
		minimumFractionDigits: num < 1 ? 4 : 2,
		maximumFractionDigits: num < 1 ? 6 : 2
	}).format(num);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: NumericValue, decimals: number = 2): string {
	const num = Number(value);
	
	if (isNaN(num)) return '0%';
	
	const sign = num > 0 ? '+' : '';
	return sign + num.toFixed(decimals) + '%';
}

/**
 * Format supply with appropriate suffixes
 */
export function formatSupply(supply: NumericValue, decimals: NumericValue = 18): string {
	const supplyNum = typeof supply === 'bigint' ? Number(supply) : Number(supply);
	const decimalsNum = typeof decimals === 'bigint' ? Number(decimals) : Number(decimals);
	
	if (isNaN(supplyNum) || isNaN(decimalsNum)) return '0';
	
	const actualSupply = supplyNum / Math.pow(10, decimalsNum);
	
	return formatLargeNumber(actualSupply, 1);
}

/**
 * Format market cap
 */
export function formatMarketCap(marketCap: NumericValue): string {
	const num = Number(marketCap);
	
	if (isNaN(num) || num === 0) return 'N/A';
	
	return '$' + formatLargeNumber(num, 2);
}

/**
 * Smart number formatter that adapts based on value size
 */
export function formatSmart(value: NumericValue, options: SmartFormatOptions = {}): string {
	const {
		decimals = 'auto',
		compact = true,
		prefix = '',
		suffix = '',
		minDecimals = 0,
		maxDecimals = 6,
		decimalsFromValue = 0
	} = options;

	const raw = typeof value === 'bigint' ? Number(value) : Number(value);
	if (isNaN(raw)) return prefix + '0' + suffix;

	// Escalar el valor con base en los decimales indicados en los metadatos
	const scaled = raw / Math.pow(10, decimalsFromValue);

	let formatted: string;

	if (compact && Math.abs(scaled) >= 1000) {
		const decimalPlaces = decimals === 'auto' ? 2 : decimals;
		formatted = formatLargeNumber(scaled, decimalPlaces);
	} else {
		let decimalPlaces: number = decimals === 'auto' ? 2 : decimals;

		if (decimals === 'auto') {
			if (Math.abs(scaled) < 0.001) decimalPlaces = 6;
			else if (Math.abs(scaled) < 0.1) decimalPlaces = 4;
			else if (Math.abs(scaled) < 1) decimalPlaces = 3;
			else if (Math.abs(scaled) < 100) decimalPlaces = 2;
			else decimalPlaces = 1;
		}

		decimalPlaces = Math.max(minDecimals, Math.min(maxDecimals, decimalPlaces));
		formatted = scaled.toFixed(decimalPlaces).replace(/\.?0+$/, '');
	}

	return prefix + formatted + suffix;
}

/**
 * Format timestamp to relative time (e.g., "2m ago", "1h ago")
 */
export function formatTimeAgo(timestamp: number | Date): string {
	const now = Date.now();
	const time = timestamp instanceof Date ? timestamp.getTime() : timestamp;
	const diff = now - time;
	
	if (diff < 0) return 'in the future';
	
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);
	
	if (seconds < 30) return 'now';
	if (seconds < 60) return `${seconds}s ago`;
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	if (weeks < 4) return `${weeks}w ago`;
	if (months < 12) return `${months}mo ago`;
	return `${years}y ago`;
}

/**
 * Format timestamp to short relative time (e.g., "2m", "1h")
 */
export function formatTimeShort(timestamp: number | Date): string {
	const now = Date.now();
	const time = timestamp instanceof Date ? timestamp.getTime() : timestamp;
	const diff = now - time;
	
	if (diff < 0) return 'future';
	
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);
	
	if (seconds < 30) return 'now';
	if (seconds < 60) return `${seconds}s`;
	if (minutes < 60) return `${minutes}m`;
	if (hours < 24) return `${hours}h`;
	if (days < 7) return `${days}d`;
	if (weeks < 4) return `${weeks}w`;
	if (months < 12) return `${months}mo`;
	return `${years}y`;
}

/**
 * Format timestamp to readable date/time
 */
export function formatDateTime(
	timestamp: number | Date, 
	options: TimeFormatOptions = {}
): string {
	const {
		style = 'relative',
		showSeconds = false,
		locale = 'en-US'
	} = options;
	
	const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
	
	if (isNaN(date.getTime())) return 'Invalid Date';
	
	switch (style) {
		case 'relative':
			return formatTimeAgo(timestamp);
			
		case 'absolute':
			return new Intl.DateTimeFormat(locale, {
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				...(showSeconds && { second: '2-digit' })
			}).format(date);
			
		case 'full':
			return new Intl.DateTimeFormat(locale, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				...(showSeconds && { second: '2-digit' })
			}).format(date);
			
		default:
			return formatTimeAgo(timestamp);
	}
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	
	if (days > 0) return `${days}d ${hours % 24}h`;
	if (hours > 0) return `${hours}h ${minutes % 60}m`;
	if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
	return `${seconds}s`;
}

/**
 * Format duration in seconds to compact format
 */
export function formatDurationCompact(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	
	if (days > 0) return `${days}d`;
	if (hours > 0) return `${hours}h`;
	if (minutes > 0) return `${minutes}m`;
	return `${seconds}s`;
}

/**
 * Smart time formatter that adapts based on how recent the timestamp is
 */
export function formatTimeSmart(timestamp: number | Date): string {
	const now = Date.now();
	const time = timestamp instanceof Date ? timestamp.getTime() : timestamp;
	const diff = now - time;
	
	// If within last hour, show relative time
	if (diff < 3600000) { // 1 hour
		return formatTimeShort(timestamp);
	}
	
	// If within last 24 hours, show time
	if (diff < 86400000) { // 1 day
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(time));
	}
	
	// If within last week, show day and time
	if (diff < 604800000) { // 1 week
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(time));
	}
	
	// Otherwise show date
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric'
	}).format(new Date(time));
}