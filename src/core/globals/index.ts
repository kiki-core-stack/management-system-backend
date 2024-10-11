import type { Context, Env, Input } from 'hono';
import type { Promisable } from 'type-fest';

declare global {
	function defineRouteHandler<I extends Input = {}, E extends Env = any, P extends string = any>(handler: (ctx: Context<E, P, I>) => Promise<Response> | Response): (ctx: Context) => Promisable<Response>;
}

globalThis.defineRouteHandler = (handler) => handler;
