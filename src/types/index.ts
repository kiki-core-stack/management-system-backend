import type { H, MiddlewareHandler } from 'hono/types';

export type {} from '@kikiutils/kiki-core-stack-pack/types';

interface RouteHandlerProperties {
	isRouteHandler?: boolean;
}

declare global {
	type RouteHandler = H & Partial<RouteHandlerProperties>;
	type RouteValidators = MiddlewareHandler[];
}
