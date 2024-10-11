import type { Context, Env, Input } from 'hono';

declare global {
	function defineRouteHandler<I extends Input = {}, E extends Env = any, P extends string = any>(handler: (ctx: Context<E, P, I>) => Promise<Response> | Response): (ctx: Context) => Promise<Response> | Response;
}

globalThis.defineRouteHandler = (handler) => handler;
