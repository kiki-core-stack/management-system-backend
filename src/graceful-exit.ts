import type { Server } from 'bun';

import { logger } from '@/core/utils/logger';

let isGracefulExitStarted = false;

export async function gracefulExit(server?: Server) {
    if (isGracefulExitStarted) return;
    isGracefulExitStarted = true;
    logger.info('Graceful shutdown started.');
    await server?.stop(true);
    // Perform operations such as closing the database connection here.
    logger.success('Graceful shutdown completed.');
    process.exit(0);
}
