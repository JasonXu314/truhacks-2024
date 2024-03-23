import { InternalServerErrorException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { serialize } from 'src/utils/utils';

const template = readFileSync('src/client/templates/page.html').toString();

export function svelte(path: string, data: any, next: (e: any, rendered?: string) => void) {
	const { props, __meta } = data;

	import(/* @vite-ignore */ `${process.cwd()}/dist/client/routes/${__meta.route}`)
		.then(({ default: page }) => {
			try {
				const { html, head } = page.render(props, __meta);

				const initialProps = serialize(props),
					routeMeta = serialize(__meta);

				next(
					null,
					template
						.replace(
							'%SVELTE_HEAD%',
							`${head}\n<script id="__init_script__">window.__INITIAL_PROPS=${initialProps};window.__ROUTE_META=${routeMeta}</script>`
						)
						.replace('%SVELTE_BODY%', `${html}\n<script type="module" src="/__app/${__meta.route.slice(1)}.js"></script>`)
				);
			} catch (err) {
				console.error(err);
				next(new InternalServerErrorException(`Unable to render route /${__meta.route.replace(/\/index$/, '')}`));
			}
		})
		.catch((err) => {
			console.error(err);
			next(new InternalServerErrorException(`Unable to render route /${__meta.route.replace(/\/index$/, '')}`));
		});
}

