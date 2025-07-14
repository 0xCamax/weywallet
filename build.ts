import * as esbuild from 'https://deno.land/x/esbuild@v0.17.19/mod.js';
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts';
import { generate_mappings, log } from './utils.ts';

await generate_mappings();

await esbuild
	.build({
		plugins: [
			...denoPlugins({
				importMapURL: new URL('./mappings.json', import.meta.url).toString(),
			}),
		],
		entryPoints: [
			'./src/ui/popup.tsx',
			'./src/ui/sidepanel.tsx',
			'./src/background/index.ts',
			'./src/content_script/index.js',
			'./src/content_script/injected/index.js',

		],
		outdir: 'dist',
		bundle: true,
		format: 'iife',
		splitting: false,
		sourcemap: false,
		minify: true,
		jsx: 'automatic',
		jsxImportSource: 'preact',
		target: 'es2022',
	})
	.then((res) => {
		if (res.errors.length > 0) {
			log('esbuild', ...res.errors.map((e) => e.detail as string));
		} else {
			log('esbuild', 'ok');
		}
	});

esbuild.stop();

const css = new Deno.Command('deno', {
	args: [
		'run',
		'-A',
		'npm:postcss-cli',
		'src/index.css',
		'-o',
		'dist/index.css',
		'--config',
		'./postcss.config.js',
	],
});

const { code, stderr } = await css.output();
if (code === 0) {
	log('css', 'ok');
} else {
	log('css', 'Error:', new TextDecoder().decode(stderr));
}

await Deno.copyFile('src/popup.html', 'dist/popup.html');
await Deno.copyFile('src/sidepanel.html', 'dist/sidepanel.html');
await Deno.copyFile('src/public/icon.png', 'dist/icon.png');

const manifest = {
	manifest_version: 3,
	name: 'Wey Wallet',
	version: '1.0.0',
	description: 'Wallet para administrar claves privadas',
	action: {
		default_popup: 'popup.html',
		default_icon: 'icon.png',
	},
	icons: {
		128: 'icon.png',
	},
	background: {
		service_worker: 'background/index.js',
		type: 'module',
	},
	content_scripts: [
		{
			matches: ['<all_urls>'],
			js: ['content_script/index.js'],
			run_at: 'document_start',
		},
	],
	web_accessible_resources: [
		{
			resources: ['content_script/injected/index.js'],
			matches: ['<all_urls>'],
		},
	],
	permissions: ['storage', 'scripting', 'tabs', 'sidePanel'],
	host_permissions: ['<all_urls>'],
	side_panel: {
		default_path: 'sidepanel.html',
	},
};

await Deno.writeTextFile(
	'dist/manifest.json',
	JSON.stringify(manifest, null, 2)
);

Deno.exit(code);
