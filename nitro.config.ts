//https://nitro.unjs.io/config
export default defineNitroConfig({
	alias: { '@': '~/' },
	compressPublicAssets: true,
	errorHandler: '@kikiutils/kiki-core-stack-pack/nitropack/handlers/error',
	minify: process.env.NODE_ENV !== 'development',
	noPublicDir: true,
	serveStatic: false,
	sourceMap: false,
	typescript: {
		strict: true,
		tsConfig: {
			compilerOptions: { baseUrl: '../../', paths: { '@/*': ['./*'] } },
			extends: '@kikiutils/tsconfigs/esnext/esnext.json'
		}
	}
});
