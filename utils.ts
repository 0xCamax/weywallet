// generate-mapping.ts

export async function generate_mappings() {
	const denoConfig = JSON.parse(await Deno.readTextFile('deno.json'));
	const imports = denoConfig.imports ?? {};

	const outputImports: Record<string, string> = {};

	for (const [key, value] of Object.entries(imports)) {
		if (typeof value !== 'string' || !value.startsWith('npm:')) continue;

		const [, pkg] = value.split('npm:');

		const baseURL = `https://esm.sh/${pkg}`;

		outputImports[key] = baseURL;

		outputImports[`${key}/`] = `${baseURL}/`;
	}

	await Deno.writeTextFile(
		'mappings.json',
		JSON.stringify({ imports: outputImports }, null, 2)
	);
}

export function log(source: string, ...msgs: string[]) {
	console.log(`[${source}]`, ...msgs);
}
