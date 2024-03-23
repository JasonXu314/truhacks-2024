import { build } from 'vite';
import { collectDir } from './dev-utils.mjs';

const sources = collectDir('src/client/routes').flatMap((route) => {
	let matches;
	if ((matches = /src\/client\/routes\/(.+)\.svelte$/.exec(route)) !== null) {
		return [`src/__client/routes/${matches[1]}`];
	} else {
		return [];
	}
});

await build({
	configFile: 'config/client/vite.config.mts',
	build: {
		rollupOptions: {
			input: sources,
			output: {
				dir: 'dist/client'
			}
		}
	}
});

await build({
	configFile: 'config/client/vite.config.mts',
	build: {
		ssr: true,
		emptyOutDir: false,
		rollupOptions: {
			input: sources,
			output: {
				dir: 'dist/client'
			}
		}
	}
});

await build({
	configFile: 'config/server/vite.config.mts',
	build: {
		emptyOutDir: false
	}
});

