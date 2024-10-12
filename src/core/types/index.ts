import type { Context as _Context, Env, Input } from 'hono';
import type { H, MiddlewareHandler } from 'hono/types';

export interface RouteHandlerProperties {
	isRouteHandler?: boolean;
}

declare global {
	type Context<E extends Env = any, P extends string = any, I extends Input = {}> = _Context<E, P, I>;
	type RouteHandler = H & Partial<RouteHandlerProperties>;
	type RouteValidators = MiddlewareHandler[];
}
