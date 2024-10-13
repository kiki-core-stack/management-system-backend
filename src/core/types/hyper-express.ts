import type { RouteRecord, Server } from '@kikiutils/hyper-express';

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
}
