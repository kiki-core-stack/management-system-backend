import type { DefaultRequestLocals, DefaultResponseLocals, MiddlewareNext, Request, Response, RouteRecord, Server, UserRouteHandler, UserRouteOptions } from '@kikiutils/hyper-express';

export type MiddlewareHandler<RequestLocals extends {} = {}, ResponseLocals extends {} = {}> = (request: Request<RequestLocals & DefaultRequestLocals>, response: Response<ResponseLocals & DefaultResponseLocals>, next: MiddlewareNext) => any;

interface Route extends RouteRecord {
	app: Server;
	id: number;
	handler: UserRouteHandler & RouteHandlerProperties;
	max_body_length: number;
	path: string;
	path_parameters_key: string[];
	streaming: object;
}

export interface RouteHandlerOptions extends UserRouteOptions {
	properties?: RouteHandlerProperties;
}

export interface RouteHandlerProperties {}

declare module '@kikiutils/hyper-express' {
	interface Request {
		route?: Route;
	}
}
