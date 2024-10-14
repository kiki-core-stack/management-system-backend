import { Server } from '@kikiutils/hyper-express';
import type { ServerConstructorOptions } from '@kikiutils/hyper-express';
import { EventEmitter } from 'eventemitter3';

export const createServer = (options?: ServerConstructorOptions) => {
	const server = new Server(options);
	server.locals.eventManager = new EventEmitter();
	return server;
};
