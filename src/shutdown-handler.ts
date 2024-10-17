import { mongooseConnections } from '@kikiutils/kiki-core-stack-pack/constants/mongoose';
import { redisInstance } from '@kikiutils/kiki-core-stack-pack/constants/redis';
import logger from '@kikiutils/node/consola';
import type { Connection } from 'mongoose';

import { sessionStorage } from '@/core/middlewares/session/constants';
import { server } from './server';

async function handleShutdown() {
	logger.info('Shutting down server...');
	process.env.NODE_ENV === 'production' ? await server.shutdown() : server.close();
	await redisInstance.quit();
	await sessionStorage.dispose();
	await Promise.all(Object.values(mongooseConnections).map((connection: Connection) => connection.close()));
	logger.success('Server shutdown complete');
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.on('SIGUSR2', handleShutdown);
