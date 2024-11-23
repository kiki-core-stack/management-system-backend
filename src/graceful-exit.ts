import { mongooseConnections } from '@kikiutils/kiki-core-stack-pack/constants/mongoose';
import { redisInstance } from '@kikiutils/kiki-core-stack-pack/constants/redis';
import type { Server } from 'bun';
import logger from 'consola';
import { exit } from 'node:process';

export async function gracefulExit(server?: Server) {
    logger.info('Starting graceful shutdown...');
    await server?.stop(true);
    redisInstance.disconnect();
    await mongooseConnections.default?.close();
    logger.success('Graceful shutdown completed.');
    exit(0);
}
