import logger from '@kikiutils/node/consola';
import type { Server } from '@kikiutils/hyper-express';
import { glob } from 'glob';
import path from 'path';

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
	scanDirPath = path.resolve(scanDirPath).replaceAll(path.sep, '/');
	const routeFilePathPattern = new RegExp(`^${scanDirPath}(.*?)(/index)?\\.(${allowedHttpMethods.join('|')})\\.(mj|t)s$`);
	let totalRouteCount = 0;
	const startTime = performance.now();
	const routeFilePaths = await glob(`${scanDirPath}/**/*.{${allowedHttpMethods.join(',')}}.{mj,t}s`);
	for (const routeFilePath of routeFilePaths) {
		try {
			const routeModule = await import(routeFilePath);
			if (typeof routeModule.default !== 'function') continue;
			const filePathMatches = routeFilePath.match(routeFilePathPattern);
			if (!filePathMatches) continue;
			const method = filePathMatches[3]!;
			const routeEndpoint = `${baseUrlPath}${filePathMatches[1]!}`;
			server[method as (typeof allowedHttpMethods)[number]](routeEndpoint, routeModule.default);
			totalRouteCount++;
		} catch (error) {
			// @ts-expect-error
			logger.error(`Failed to load route file: ${routeFilePath}`, error?.message);
		}
	}

	logger.info(`Successfully registered ${totalRouteCount} routes from '${path.relative(process.cwd(), scanDirPath)}' in ${(performance.now() - startTime).toFixed(2)}ms`);
};
