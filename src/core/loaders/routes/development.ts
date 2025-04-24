import type { WritableDeep } from 'type-fest';

import { honoApp } from '../../app';
import { allRoutes } from '../../constants/route';
import { zodOpenApiRegistry } from '../../constants/zod-openapi';
import { getRouteDefinitions } from '../../libs/router';
import type {
    RouteDefinition,
    RouteHandlerOptions,
} from '../../types/route';
import { logger } from '../../utils/logger';

function registerRouteModule({ module, ...routeDefinition }: RouteDefinition & { module: any }) {
    const handlers = [module.default].flat().filter(Boolean);
    if (!handlers.length) {
        logger.warn(`No handler found for route: ${routeDefinition.filePath}.`);
        return false;
    }

    const latestHandler = handlers[handlers.length - 1];
    const routeOptions: RouteHandlerOptions | undefined = module.routeHandlerOptions;
    Object.assign(latestHandler, routeOptions?.properties);
    if (module.zodOpenApiConfig) {
        zodOpenApiRegistry.registerPath({
            ...module.zodOpenApiConfig,
            method: routeDefinition.method,
            path: routeDefinition.openApiPath,
        });
    }

    Object.defineProperty(
        latestHandler,
        'isHandler',
        {
            configurable: false,
            value: true,
            writable: false,
        },
    );

    honoApp.on(routeDefinition.method, routeDefinition.path, ...handlers);
    // eslint-disable-next-line style/max-len
    (allRoutes as WritableDeep<typeof allRoutes>)[routeDefinition.method][routeDefinition.path] = { handlerProperties: routeOptions?.properties };
    return true;
}

// Entrypoint
const startTime = performance.now();
let loadedRouteCount = 0;
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

for (const routeEntry of loadedRouteModules.filter(Boolean)) {
    if (registerRouteModule(routeEntry!)) loadedRouteCount++;
}

logger.success(`Registered ${loadedRouteCount} routes in ${(performance.now() - startTime).toFixed(2)}ms.`);
