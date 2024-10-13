import type { RouteRecord, Server } from '@kikiutils/hyper-express';
import type { EventEmitter } from 'eventemitter3';

interface Route extends RouteRecord {
	app: Server;
	id: number;
	max_body_length: number;
	path: string;
	path_parameters_key: string[];
	streaming: object;
}

declare module '@kikiutils/hyper-express' {
	interface Request {
		route?: Route;
	}

	interface ServerLocals {
		eventManager: EventEmitter;
	}
}
