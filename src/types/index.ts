import type { H } from 'hono/types';

export type {} from '@kikiutils/kiki-core-stack-pack/types';

interface RouteHandlerProperties {}

declare global {
	type RouteHandler = H & Partial<RouteHandlerProperties>;
}
