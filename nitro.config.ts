import { checkAndGetEnvValue } from '@kikiutils/node/env';

//https://nitro.unjs.io/config
export default defineNitroConfig({
	alias: { '@': '~/' },
	compressPublicAssets: true,
	minify: process.env.NODE_ENV !== 'development',
	noPublicDir: true,
	runtimeConfig: {
		nitroSession: {
			storage: {
				data: {
					driver: 'cookie/header',
					options: {
						encodingOptions: { key: (process.env.SESSION_SECRET_KEY_ENCODING || 'utf8') as BufferEncoding },
						key: checkAndGetEnvValue('SESSION_SECRET_KEY')
					}
				}
			},
			strictIpValidation: true
		}
	},
	serveStatic: false,
	sourceMap: false,
	typescript: {
		strict: true,
		tsConfig: {
			compilerOptions: {
				baseUrl: '../../',
				noImplicitOverride: true,
				noUncheckedIndexedAccess: true,
				noUnusedLocals: true,
				noUnusedParameters: true,
				paths: { '@/*': ['./*'] }
			}
		}
	}
});
