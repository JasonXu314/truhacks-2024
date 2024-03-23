import { existsSync, readFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import preprocessor from 'svelte-preprocess';
import { compile, preprocess } from 'svelte/compiler';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		(() => {
			let isSSR = false;

			return {
				name: 'svelte',
				enforce: 'pre',
				async resolveId(source, importer, options) {
					let matches: RegExpExecArray | null;
					if (source === '__route.svelte') {
						if (!importer) throw new Error('__route.svelte used as entry');

						if ((matches = /__client\/routes\/(.+)$/.exec(importer)) === null) throw new Error("Imported '__route.svelte' not from route");

						return `src/client/routes/${matches[1]}.svelte`;
					}

					if (source === '__app.svelte') {
						if (!importer) throw new Error('__app.svelte used as entry');

						return 'src/client/templates/app.svelte';
					}

					if (source === '$meta') {
						if (!importer) throw new Error('$meta used as entry');

						return 'src/client/templates/$meta.js';
					}

					if (options.isEntry) {
						return source;
					} else if (!basename(source).includes('.')) {
						const relative = source.startsWith('./') || source.startsWith('../');

						if (relative) {
							const path = resolve(dirname(importer!), source) + '.ts';

							if (existsSync(path)) {
								return path;
							} else {
								return null;
								// this.error(`Unable to resolve ${source}, imported from ${importer}`);
							}
						} else if ((matches = /\$lib\/(.+)/.exec(source)) !== null) {
							const path = `src/client/lib/${matches[1]}.ts`;

							if (existsSync(path)) {
								return path;
							} else {
								return null;
								// this.error(`Unable to resolve ${source}, imported from ${importer}`);
							}
						} else {
							const path = `${source}.ts`;

							if (existsSync(path)) {
								return path;
							} else {
								return null;
								// this.error(`Unable to resolve ${source}, imported from ${importer}`);
							}
						}
					} else if (source.endsWith('.svelte') || source.endsWith('.ts')) {
						const relative = source.startsWith('./') || source.startsWith('../');

						if (relative) {
							return resolve(dirname(importer!), source);
						} else if ((matches = /\$lib\/(.+)/.exec(source)) !== null) {
							return `src/client/lib/${matches[1]}`;
						} else {
							return source;
						}
					} else {
						return null;
					}
				},
				async load(id, options) {
					if (/__client\/routes\/(.+)$/.test(id)) {
						if (options?.ssr) {
							// this.error(`SSR rendering route ${id} not captured by resolveId`);
							return readFileSync('src/client/templates/server.js').toString();
						} else {
							return readFileSync('src/client/templates/client.js').toString();
						}
					} else {
						return null;
					}
				},
				async transform(code, id, options) {
					// this.info(`transforming ${id}`);
					if (!id.endsWith('.svelte')) return null;
					if (options?.ssr) isSSR = true;

					let matches = /.*\/([^/]+\.svelte)/.exec(id);
					if (!matches) throw new Error('Svelte matching error');
					const filename = matches[1];

					const preprocessed = await preprocess(code, preprocessor({ typescript: { compilerOptions: { module: 'es2020', target: 'es2020' } } }), {
						filename
					});

					matches = /src\/client\/components\/(.+).svelte/.exec(id);
					const result = compile(preprocessed.code, {
						generate: options?.ssr ? 'ssr' : 'dom',
						hydratable: true,
						name: matches?.[1].split('/').at(-1) || 'App'
					});

					return { ...result.js };
				},
				generateBundle(options, bundle) {
					if (isSSR) {
						Object.entries(bundle).forEach(([, chunk]) => {
							if (chunk.type === 'chunk' && chunk.facadeModuleId) {
								const matches = /src\/__client\/routes\/(.+)/.exec(chunk.facadeModuleId);

								if (matches) {
									const route = matches[1];
									// this.info(`route ${route} imports: ${JSON.stringify(chunk.imports)}`);

									chunk.imports.forEach((id) => {
										// this.info(`route ${route} importing ${id}`);
										if (id.startsWith('assets/')) {
											const path = id.split('/').slice(1);
											const routeNesting = route.split('/').length;

											const correction = new Array(routeNesting).fill('..').join('/') + '/';
											const file = path.at(-1);

											if (!file) this.error(`Failed to correct import ${id} in route ${route}`);

											const pattern = new RegExp(`import\\s*(?:\\{.*\\}\\s*from\\s*)?("./assets/${file}"|'./assets/${file}')`);
											chunk.code = chunk.code.replace(pattern, (match, subId: string) => {
												return match.replace(subId, subId.replace(`./assets/${file}`, correction + id));
											});
										}
									});

									chunk.fileName = `routes/${route}.js`;
								}
							}
						});
					} else {
						Object.entries(bundle).forEach(([, chunk]) => {
							if (chunk.type === 'chunk' && chunk.facadeModuleId) {
								const matches = /src\/__client\/routes\/(.+)/.exec(chunk.facadeModuleId);

								if (matches) {
									const route = matches[1];
									// this.info(`route ${route} imports: ${JSON.stringify(chunk.imports)}`);

									chunk.imports.forEach((id) => {
										// this.info(`route ${route} importing ${id}`);
										if (id.startsWith('assets/')) {
											const path = id.split('/').slice(1);
											const importedNesting = path.length;
											const routeNesting = route.split('/').length;

											if (routeNesting > importedNesting) {
												const correction = new Array(routeNesting - importedNesting).fill('..').join('/') + '/';
												const file = path.at(-1);

												if (!file) this.error(`Failed to correct import ${id} in route ${route}`);

												const pattern = new RegExp(`import\\s*(?:\\{.*\\}\\s*from\\s*)?("./${file}"|'./${file}')`);
												chunk.code = chunk.code.replace(pattern, (match, id: string) => {
													return match.replace(id, id.replace('./', correction));
												});
											}
										}
									});

									chunk.fileName = `assets/${route}.js`;
								}
							}
						});
					}
				}
			};
		})()
	]
});

