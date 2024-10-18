import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [
			react(),
			svgr({ include: '**/*.svg' }),
			EnvironmentPlugin('all'),
			sentryVitePlugin({
				authToken: process.env.SENTRY_AUTH_TOKEN,
				org: 'mine-92',
				project: 'javascript-react',
			}),
		],
		base: '/sand',
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		build: {
			sourcemap: true, // sentry - source map generation must be turned on
		},
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: './src/setupTests.js',
		},
	};
});
