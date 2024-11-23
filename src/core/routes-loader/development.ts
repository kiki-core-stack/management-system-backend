import { join } from 'node:path';

import logger from '@/core/libs/logger';

import { honoApp } from '../app';
import { projectSrcDirectoryPath } from '../constants';
import { loadRouteModule, scanDirectoryForRoutes } from '../libs/router';

export default async function () {
    const directoryPath = join(projectSrcDirectoryPath, 'routes');
    const startTime = performance.now();
    const scannedRoutes = await scanDirectoryForRoutes(directoryPath, '/');
    let totalRouteCount = 0;
    for (const scannedRoute of scannedRoutes) {
        try {
            loadRouteModule(honoApp, await import(scannedRoute.filePath), scannedRoute);
            totalRouteCount++;
        } catch (error) {
            logger.error(`Failed to load route file ${scannedRoute.filePath}. Error:`, (error as Error).message);
        }
    }

    logger.info(`Successfully loaded ${totalRouteCount} routes in ${(performance.now() - startTime).toFixed(2)}ms.`);
}
