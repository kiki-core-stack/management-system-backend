import type { MiddlewareHandler } from '@kikiutils/hyper-express';

declare global {
	function defineRouteHandler(handler: MiddlewareHandler): MiddlewareHandler[];
	function defineRouteHandler(handler: MiddlewareHandler, ...handlers: MiddlewareHandler[]): MiddlewareHandler[];
	function defineRouteHandler(handlers: MiddlewareHandler[]): MiddlewareHandler[];
}

globalThis.defineRouteHandler = (...handlers) => handlers.flat() as MiddlewareHandler[];
