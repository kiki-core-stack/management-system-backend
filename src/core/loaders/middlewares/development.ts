import { getMiddlewareFilePaths } from '../../libs/middleware';
import logger from '../../utils/logger';

export default async function () {
    const startTime = performance.now();
    let totalMiddlewareCount = 0;
    for (const middlewareFilePath of await getMiddlewareFilePaths()) {
        try {
            await import(middlewareFilePath);
            totalMiddlewareCount++;
        } catch (error) {
            logger.error(`Failed to load middleware file ${middlewareFilePath}. Error:`, (error as Error).message);
        }
    }

    // eslint-disable-next-line style/max-len
    logger.success(`Successfully loaded ${totalMiddlewareCount} middlewares in ${(performance.now() - startTime).toFixed(2)}ms.`);
}
