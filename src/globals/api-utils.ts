import type { Context, Env, Input } from 'hono';
import type { Promisable } from 'type-fest';

import { jsonResponseHeaders, successResponseText } from '@/constants/response';

declare global {
	function createApiSuccessResponseData<D extends object>(data?: D, message?: string): ApiResponseData<D>;
	function createApiSuccessResponseData<D extends object>(message?: string, data?: D): ApiResponseData<D>;
	function defineApiRouteHandler<I extends Input = {}, E extends Env = any, P extends string = any, D extends object = {}>(handler: (ctx: Context<E, P, I>) => Promisable<ApiResponseData<D> | void>): (ctx: Context) => Promise<Response>;
}

globalThis.createApiSuccessResponseData = (arg1: any, arg2?: any) => {
	if (typeof arg1 === 'string') [arg1, arg2] = [arg2, arg1];
	return { data: arg1 || {}, message: arg2 ?? '成功', success: true };
};

globalThis.defineApiRouteHandler = (handler) => async (ctx: Context) => {
	const data = await handler(ctx);
	if (!data) return ctx.text(successResponseText, 200, jsonResponseHeaders);
	return ctx.json(data);
};
