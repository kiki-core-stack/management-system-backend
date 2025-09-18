import type { Server } from 'bun';

import { mongooseConnections } from '@kikiutils/mongoose/constants';

import { logger } from '@/core/utils/logger';

let isGracefulExitStarted = false;

export async function gracefulExit(server?: Server) {
    if (isGracefulExitStarted) return;
    isGracefulExitStarted = true;
    logger.info('Starting graceful shutdown...');
    await server?.stop(true);

    // Perform operations such as closing the database connection here.
    await mongooseConnections.default?.close();

    logger.success('Graceful shutdown completed');
    process.exit(0);
}
