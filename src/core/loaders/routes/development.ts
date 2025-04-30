import {
    getRouteDefinitions,
    processRouteHandlers,
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
            logger.error(`Failed to import route at ${routeDefinition.filePath}.`, error);
        }
    }),
);

let loadedRouteCount = 0;
for (const routeEntry of loadedRouteModules.filter(Boolean)) {
    const handlers = processRouteHandlers(routeEntry?.module.default);
    if (!handlers.length) {
        logger.warn(`No handler found for route at ${routeEntry!.filePath}.`);
        continue;
    }

    if (routeEntry!.module.zodOpenApiConfig && routeEntry!.module.getZodOpenApiConfig) {
        // eslint-disable-next-line style/max-len
        logger.warn(`Both zodOpenApiConfig and getZodOpenApiConfig found for route at ${routeEntry!.filePath}, using zodOpenApiConfig.`);
    }

    const zodOpenApiConfig = routeEntry!.module.zodOpenApiConfig ?? routeEntry!.module.getZodOpenApiConfig?.();
    await registerRoute(
        routeEntry!.method,
        routeEntry!.path,
        handlers,
        routeEntry!.module.routeHandlerOptions,
        zodOpenApiConfig
            ? {
                config: zodOpenApiConfig,
                path: routeEntry!.openApiPath,
            }
            : undefined,
    );

    loadedRouteCount++;
}

logger.success(`Registered ${loadedRouteCount} routes in ${(performance.now() - startTime).toFixed(2)}ms.`);
