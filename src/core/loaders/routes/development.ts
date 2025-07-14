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
            logger.error(`Failed to import route at ${routeDefinition.filePath}: ${(error as Error).message}`);
        }
    }),
);

let loadedRouteCount = 0;
for (const routeEntry of loadedRouteModules.filter((loadedRouteModule) => loadedRouteModule !== undefined)) {
    const handlers = processRouteHandlers(routeEntry.module.default);
    if (!handlers.length) {
        logger.warn(`No handler found for route at ${routeEntry.filePath}`);
        continue;
    }

    if (routeEntry.module.zodOpenApiConfig && routeEntry.module.getZodOpenApiConfig) {
        // eslint-disable-next-line style/max-len
        logger.warn(`Both getZodOpenApiConfig and zodOpenApiConfig found for route at ${routeEntry.filePath}, using zodOpenApiConfig`);
    }

    let zodOpenApiConfig;
    if (routeEntry.module.zodOpenApiConfig) {
        if (typeof routeEntry.module.zodOpenApiConfig === 'object') {
            // eslint-disable-next-line style/max-len
            logger.warn(`To optimize tree shaking in production, it is recommended to use getZodOpenApiConfig instead of zodOpenApiConfig at ${routeEntry.filePath}`);
            zodOpenApiConfig = routeEntry.module.zodOpenApiConfig;
        } else logger.warn(`zodOpenApiConfig found for route at ${routeEntry.filePath} is not an object`);
    } else if (routeEntry.module.getZodOpenApiConfig) {
        if (typeof routeEntry.module.getZodOpenApiConfig === 'function') {
            zodOpenApiConfig = routeEntry.module.getZodOpenApiConfig();
        } else logger.warn(`getZodOpenApiConfig found for route at ${routeEntry.filePath} is not a function`);
    }

    await registerRoute(
        routeEntry.method,
        routeEntry.path,
        handlers,
        routeEntry.module.routeHandlerOptions,
        zodOpenApiConfig
            ? {
                config: zodOpenApiConfig,
                path: routeEntry.openApiPath,
            }
            : undefined,
    );

    loadedRouteCount++;
}

logger.success(`Registered ${loadedRouteCount} routes in ${(performance.now() - startTime).toFixed(2)}ms`);
