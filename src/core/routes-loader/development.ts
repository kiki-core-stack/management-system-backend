import logger from '@kikiutils/node/consola';
import { join, relative } from 'node:path';
import { cwd } from 'node:process';

import { honoApp } from '../app';
import { projectSrcDirectoryPath } from '../constants';
import { loadRouteModule, scanDirectoryForRoutes } from '../libs/router';

(async () => {
	const directoryPath = join(projectSrcDirectoryPath, 'routes');
	const startTime = performance.now();
	const scannedRoutes = await scanDirectoryForRoutes(directoryPath, '/');
	let totalRouteCount = 0;
	for (const scannedRoute of scannedRoutes) {
		try {
			loadRouteModule(honoApp, await import(scannedRoute.filePath), scannedRoute);
			totalRouteCount++;
		} catch (error) {
			logger.error(`Failed to load route file: ${scannedRoute.filePath}`, (error as Error).message);
		}
	}

	logger.info(`Successfully registered ${totalRouteCount} routes from '${relative(cwd(), directoryPath)}' in ${(performance.now() - startTime).toFixed(2)}ms`);
})();
