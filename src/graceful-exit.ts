import type { Server } from 'bun';

import { redisInstance } from '@kiki-core-stack/pack/constants/redis';
import { mongooseConnections } from '@kikiutils/mongoose/constants';

import { logger } from '@/core/utils/logger';

let isGracefulExitStarted = false;

export async function gracefulExit(server?: Server<any>) {
    if (isGracefulExitStarted) return;
    isGracefulExitStarted = true;
    logger.info('Starting graceful shutdown...');
    await server?.stop();

    // Perform operations such as closing the database connection here.
    await redisInstance.quit();
    await mongooseConnections.default?.close();

    logger.success('Graceful shutdown completed');
    process.exit(0);
}
