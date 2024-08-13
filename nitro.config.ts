//https://nitro.unjs.io/config
export default defineNitroConfig({
	alias: { '@': '~/' },
	compressPublicAssets: true,
	minify: process.env.NODE_ENV !== 'development',
	noPublicDir: true,
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
