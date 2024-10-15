import { build } from 'esbuild';
import { rm } from 'fs/promises';
import { replaceTscAliasPaths } from 'tsc-alias';

const outDir = './.development';

(async () => {
	await rm(outDir, { force: true, recursive: true });
	await build({
		bundle: false,
		entryPoints: ['./src/**/*.ts'],
		format: 'esm',
		outdir: outDir,
		outExtension: { '.js': '.mjs' },
		platform: 'node',
		target: 'esnext'
	});

	await replaceTscAliasPaths({ resolveFullPaths: true, resolveFullExtension: '.mjs', outDir });
})();
