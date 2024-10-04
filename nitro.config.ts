import { checkAndGetEnvValue } from '@kikiutils/node/env';

import nitroSessionConfig from './nitro-session.config.local';

const nitroSessionEnvConfig = nitroSessionConfig[checkAndGetEnvValue('NODE_ENV') as keyof typeof nitroSessionConfig];
if (!nitroSessionEnvConfig) throw new Error(`InvalidNitroSessionConfigError: No configuration found for NODE_ENV=${checkAndGetEnvValue('NODE_ENV')}`);

//https://nitro.unjs.io/config
export default defineNitroConfig({
	alias: { '@': '~/' },
	compatibilityDate: '2100-01-01',
	compressPublicAssets: true,
	errorHandler: '@/handlers/error',
	minify: process.env.NODE_ENV !== 'development',
	noPublicDir: true,
	runtimeConfig: { nitroSession: nitroSessionEnvConfig },
	serveStatic: false,
	sourceMap: false,
	timing: process.env.NODE_ENV === 'development',
	typescript: {
		strict: true,
		tsConfig: {
			compilerOptions: { paths: { '@/*': ['../../*'] } },
			extends: '@kikiutils/tsconfigs/esnext/esnext.json'
		}
	}
});
