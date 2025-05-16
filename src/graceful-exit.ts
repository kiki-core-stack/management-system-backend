import type { Server } from 'bun';

import { mongooseConnections } from '@kiki-core-stack/pack/constants/mongoose';

import { logger } from '@/core/utils/logger';

let isGracefulExitStarted = false;

export async function gracefulExit(server?: Server) {
    if (isGracefulExitStarted) return;
    isGracefulExitStarted = true;
    logger.info('Graceful shutdown started.');
    await server?.stop(true);
    // Perform operations such as closing the database connection here.
    await mongooseConnections.default?.close();
    logger.success('Graceful shutdown completed.');
    process.exit(0);
}
