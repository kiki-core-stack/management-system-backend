import {
    getRouteDefinitions,
    loadRouteModule,
} from '../../libs/router';
import logger from '../../utils/logger';

export default async function () {
    const startTime = performance.now();
    let totalRouteCount = 0;
    for (const routeDefinition of await getRouteDefinitions()) {
        try {
            loadRouteModule(await import(routeDefinition.filePath), routeDefinition);
            totalRouteCount++;
        } catch (error) {
            logger.error(`Failed to load route file ${routeDefinition.filePath}. Error:`, (error as Error).message);
        }
    }

    logger.success(`Successfully loaded ${totalRouteCount} routes in ${(performance.now() - startTime).toFixed(2)}ms.`);
}
