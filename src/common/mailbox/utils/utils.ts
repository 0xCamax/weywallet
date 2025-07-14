import { StandardPayload } from './types.ts';

export async function getCurrentTab(): Promise<number> {
	const queryOptions: chrome.tabs.QueryInfo = {
		active: true,
		lastFocusedWindow: true,
	};
	const [response] = await chrome.tabs.query(queryOptions);
	return response.id!;
}

export function createPayload<T = any>(
	data: T,
	method?: string,
	meta?: Record<string, any>
): StandardPayload<T> {
	return {
		data,
		method,
		timestamp: Date.now(),
		meta: meta || {},
	};
}
