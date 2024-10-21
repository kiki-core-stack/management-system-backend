import logger from '@kikiutils/node/consola';
import { glob } from 'glob';
import type { Hono } from 'hono';
import { relative, resolve, sep } from 'path';

import { zodOpenAPIRegistry } from '@/core/constants/zod-openapi';
import type { RouteHandlerOptions } from '@/core/types/route';

const allowedHttpMethods = [
	'delete',
	'get',
	'head',
	'options',
	'patch',
	'post',
	'purge',
	'put'
] as const;

export const registerRoutesFromFiles = async (honoApp: Hono, scanDirPath: string, baseUrlPath: string) => {
	scanDirPath = resolve(scanDirPath).replaceAll(sep, '/');
	const routeFilePathPattern = new RegExp(`^${scanDirPath}(.*?)(/index)?\\.(${allowedHttpMethods.join('|')})\\.(mj|t)s$`);
	let totalRouteCount = 0;
	const startTime = performance.now();
	const routeFilePaths = await glob(`${scanDirPath}/**/*.{${allowedHttpMethods.join(',')}}.{mj,t}s`);
	for (const routeFilePath of routeFilePaths) {
		try {
			const routeModule = await import(routeFilePath);
			const handlers = [routeModule.default].flat().filter((handler) => handler !== undefined);
			if (!handlers.length) continue;
			const matches = routeFilePath.match(routeFilePathPattern);
			if (!matches) continue;
			const method = matches[3]!;
			const routePath = `${baseUrlPath}${matches[1]!}`.replaceAll(/\/+/g, '/');
			const latestHandler = handlers.at(-1);
			const routeHandlerOptions: RouteHandlerOptions | undefined = routeModule.handlerOptions || routeModule.options || routeModule.routeHandlerOptions;
			if (routeHandlerOptions) {
				if (routeHandlerOptions.environment) {
					const environments = [routeHandlerOptions.environment].flat() as string[];
					if (environments.length && process.env.NODE_ENV && !environments.includes(process.env.NODE_ENV)) continue;
				}

				Object.assign(latestHandler, routeHandlerOptions.properties);
			}

			if (routeModule.zodOpenAPIConfig) {
				zodOpenAPIRegistry.registerPath({
					...routeModule.zodOpenAPIConfig,
					method,
					path: routePath.replaceAll(/\[([^/]+)\]/g, '{$1}')
				});
			}

			Object.defineProperty(latestHandler, 'isHandler', {
				configurable: false,
				value: true,
				writable: false
			});

			honoApp.on(method, routePath.replaceAll(/\[([^/]+)\]/g, ':$1'), ...handlers);
			totalRouteCount++;
		} catch (error) {
			logger.error(`Failed to load route file: ${routeFilePath}`, (error as Error).message);
		}
	}

	logger.info(`Successfully registered ${totalRouteCount} routes from '${relative(process.cwd(), scanDirPath)}' in ${(performance.now() - startTime).toFixed(2)}ms`);
};
