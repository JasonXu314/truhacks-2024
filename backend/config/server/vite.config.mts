import { ConfigEnv, defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }: ConfigEnv) => {
	return {
		server: {
			port: 5000
		},
		build: {
			target: 'es2020'
		},
		plugins: [
			tsconfigPaths(),
			...VitePluginNode({
				adapter: 'nest',
				appPath: 'src/main.ts',
				tsCompiler: 'swc',
				swcOptions: {
					configFile: 'config/server/.swcrc'
				}
			})
		]
	};
});

