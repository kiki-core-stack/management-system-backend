import logger from '@kikiutils/node/consola';
import type { Server } from '@kikiutils/hyper-express';
import { glob } from 'glob';
import { relative, resolve, sep } from 'path';

const allowedHttpMethods = [
	'connect',
	'delete',
	'get',
	'head',
	'options',
	'patch',
	'post',
	'put',
	'trace'
] as const;

export const registerRoutesFromFiles = async (server: Server, scanDirPath: string, baseUrlPath: string) => {
	scanDirPath = resolve(scanDirPath).replaceAll(sep, '/');
	const routeFilePathPattern = new RegExp(`^${scanDirPath}(.*?)(/index)?\\.(${allowedHttpMethods.join('|')})\\.(mj|t)s$`);
	let totalRouteCount = 0;
	const startTime = performance.now();
	const routeFilePaths = await glob(`${scanDirPath}/**/*.{${allowedHttpMethods.join(',')}}.{mj,t}s`);
	for (const routeFilePath of routeFilePaths) {
		try {
			const routeModule = await import(routeFilePath);
			if (typeof routeModule.default !== 'function') continue;
			const matches = routeFilePath.match(routeFilePathPattern);
			if (!matches) continue;
			const method = matches[3]!;
			const routePath = `${baseUrlPath}${matches[1]!}`;
			server[method as (typeof allowedHttpMethods)[number]](routePath, routeModule.default);
			totalRouteCount++;
		} catch (error) {
			logger.error(`Failed to load route file: ${routeFilePath}`, (error as Error).message);
		}
	}

	logger.info(`Successfully registered ${totalRouteCount} routes from '${relative(process.cwd(), scanDirPath)}' in ${(performance.now() - startTime).toFixed(2)}ms`);
};
