export type ActionParams = {
	open_url: { url: string };
	read_file: { path: string };
	sign_document: { document: string };
	search_query: { engine: string; query: string };
};

export type PromptAction = {
	[K in keyof ActionParams]: {
		action: K;
		params: ActionParams[K];
	};
}[keyof ActionParams];

export const Actions: {
	[K in PromptAction['action']]: (
		params: Extract<PromptAction, { action: K }>['params']
	) => unknown;
} = {
	open_url: ({ url }) => chrome.windows.create({ url }),
	read_file: ({ path }) => console.warn('Reading file:', path),
	sign_document: ({ document }) => console.warn('Signing doc:', document),
	search_query: ({ engine, query }) => {
		console.log(`Search requested: engine=${engine}, query="${query}"`);

		if (engine === 'youtube') {
			chrome.tabs.create({
				url: `https://www.youtube.com/results?search_query=${encodeURIComponent(
					query
				)}`,
			});
		} else if (engine === 'google') {
			chrome.tabs.create({
				url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
			});
		} else {
			console.warn(`Motor de búsqueda no soportado: ${engine}`);
		}
	},
};
