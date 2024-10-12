import type { H, MiddlewareHandler } from 'hono/types';

interface RouteHandlerProperties {
	isRouteHandler?: boolean;
}

declare global {
	type RouteHandler = H & Partial<RouteHandlerProperties>;
	type RouteValidators = MiddlewareHandler[];
}
