import logger from '@kikiutils/node/consola';
import type { Hono } from 'hono';
import { relative } from 'path';

import { zodOpenAPIRegistry } from '@/core/constants/zod-openapi';
import type { RouteHandlerOptions } from '@/core/types/route';
import { scanDirectoryForRoutes } from './router';

export const registerRoutesFromFiles = async (honoApp: Hono, directoryPath: string, baseUrlPath: string) => {
	let totalRouteCount = 0;
	const startTime = performance.now();
	const scannedRoutes = await scanDirectoryForRoutes(directoryPath, baseUrlPath);
	for (const scannedRoute of scannedRoutes) {
		try {
			const routeModule = await import(scannedRoute.filePath);
			const handlers = [routeModule.default].flat().filter((handler) => handler !== undefined);
			if (!handlers.length) continue;
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
					method: scannedRoute.method,
					path: scannedRoute.openAPIPath
				});
			}

			Object.defineProperty(latestHandler, 'isHandler', {
				configurable: false,
				value: true,
				writable: false
			});

			honoApp.on(scannedRoute.method, scannedRoute.path, ...handlers);
			totalRouteCount++;
		} catch (error) {
			logger.error(`Failed to load route file: ${scannedRoute.filePath}`, (error as Error).message);
		}
	}

	logger.info(`Successfully registered ${totalRouteCount} routes from '${relative(process.cwd(), directoryPath)}' in ${(performance.now() - startTime).toFixed(2)}ms`);
};
