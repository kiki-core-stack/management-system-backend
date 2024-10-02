//https://nitro.unjs.io/config
export default defineNitroConfig({
	alias: { '@': '~/' },
	compressPublicAssets: true,
	errorHandler: '@kikiutils/kiki-core-stack-pack/nitropack/handlers/error',
	minify: process.env.NODE_ENV !== 'development',
	noPublicDir: true,
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
