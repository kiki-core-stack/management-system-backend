//https://nitro.unjs.io/config
export default defineNitroConfig({
	alias: { '@': '~/' },
	compatibilityDate: '2100-01-01',
	compressPublicAssets: true,
	errorHandler: '@kikiutils/kiki-core-stack-pack/nitro/handlers/error',
	experimental: { openAPI: process.env.NODE_ENV === 'development' },
	minify: process.env.NODE_ENV !== 'development',
	noPublicDir: true,
	openAPI: { meta: { title: 'API Document', version: '0.1.0' } },
	preset: 'node-listener',
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
