import logger from '@kikiutils/node/consola';
import type { Hono } from 'hono';
import { relative } from 'node:path';
import { cwd } from 'node:process';

import { loadRouteModule, scanDirectoryForRoutes } from './router';

export async function registerRoutesFromFiles(honoApp: Hono, directoryPath: string, baseUrlPath: string) {
	let totalRouteCount = 0;
	const startTime = performance.now();
	const scannedRoutes = await scanDirectoryForRoutes(directoryPath, baseUrlPath);
	for (const scannedRoute of scannedRoutes) {
		try {
			loadRouteModule(honoApp, await import(scannedRoute.filePath), scannedRoute);
			totalRouteCount++;
		} catch (error) {
			logger.error(`Failed to load route file: ${scannedRoute.filePath}`, (error as Error).message);
		}
	}

	logger.info(`Successfully registered ${totalRouteCount} routes from '${relative(cwd(), directoryPath)}' in ${(performance.now() - startTime).toFixed(2)}ms`);
}
