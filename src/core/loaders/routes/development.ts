import {
    getRouteDefinitions,
    registerRoute,
} from '../../libs/router';
import { logger } from '../../utils/logger';

// Entrypoint
const startTime = performance.now();
const routeDefinitions = await getRouteDefinitions();
const loadedRouteModules = await Promise.all(
    routeDefinitions.map(async (routeDefinition) => {
        try {
            return {
                ...routeDefinition,
                module: await import(routeDefinition.filePath),
            };
        } catch (error) {
            logger.error(`Failed to import route: ${routeDefinition.filePath}.`, error);
        }
    }),
);

let loadedRouteCount = 0;
for (const routeEntry of loadedRouteModules.filter(Boolean)) {
    const handlers = [routeEntry?.module.default].flat().filter(Boolean);
    if (!handlers.length) {
        logger.warn(`No handler found for route: ${routeEntry!.filePath}.`);
        continue;
    }

    await registerRoute(
        routeEntry!.method,
        routeEntry!.path,
        handlers,
        routeEntry!.module.routeHandlerOptions,
        routeEntry!.module.zodOpenApiConfig
            ? {
                config: routeEntry!.module.zodOpenApiConfig,
                path: routeEntry!.openApiPath,
            }
            : undefined,
    );

    loadedRouteCount++;
}

logger.success(`Registered ${loadedRouteCount} routes in ${(performance.now() - startTime).toFixed(2)}ms.`);
