import logger from '@/core/libs/logger';

import { getMiddlewareFilePaths } from '../../libs/middleware';

export default async function () {
    const startTime = performance.now();
    const middlewareFilePaths = await getMiddlewareFilePaths();
    let totalMiddlewareCount = 0;
    for (const middlewareFilePath of middlewareFilePaths) {
        try {
            await import(middlewareFilePath);
            totalMiddlewareCount++;
        } catch (error) {
            logger.error(`Failed to load middleware file ${middlewareFilePath}. Error:`, (error as Error).message);
        }
    }

    logger.success(`Successfully loaded ${totalMiddlewareCount} middlewares in ${(performance.now() - startTime).toFixed(2)}ms.`);
}
