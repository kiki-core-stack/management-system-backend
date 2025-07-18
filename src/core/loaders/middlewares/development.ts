import { getMiddlewareFilePaths } from '../../libs/middleware';
import { logger } from '../../utils/logger';

// Entrypoint
const startTime = performance.now();
let loadedMiddlewareCount = 0;
for (const middlewareFilePath of await getMiddlewareFilePaths()) {
    try {
        await import(middlewareFilePath);
        loadedMiddlewareCount++;
    } catch (error) {
        logger.error(`Failed to load middleware at ${middlewareFilePath}: ${(error as Error).message}\n`, error);
    }
}

logger.success(`Loaded ${loadedMiddlewareCount} middlewares in ${(performance.now() - startTime).toFixed(2)}ms`);
