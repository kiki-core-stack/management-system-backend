import type { H } from 'hono/types';

export type {} from '@kikiutils/kiki-core-stack-pack/types';

interface RouteHandlerProperties {
	isRouteHandler?: boolean;
	noLoginRequired?: boolean;
}

declare global {
	type RouteHandler = H & Partial<RouteHandlerProperties>;
}
