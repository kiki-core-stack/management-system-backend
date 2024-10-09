import type { Context } from 'hono';

declare global {
	function createApiError<D extends object>(statusCode?: StatusCode, data?: D, message?: string): ApiError<D>;
	function createApiError<D extends object>(statusCode?: StatusCode, message?: string, data?: D): ApiError<D>;
	function createApiErrorAndThrow<D extends object>(statusCode?: StatusCode, data?: D, message?: string): never;
	function createApiErrorAndThrow<D extends object>(statusCode?: StatusCode, message?: string, data?: D): never;
	function createApiSuccessResponseData<D extends object>(data?: D, message?: string): ApiResponseData<D>;
	function createApiSuccessResponseData<D extends object>(message?: string, data?: D): ApiResponseData<D>;
	function defineApiHandler<D extends object = {}>(handler: (ctx: Context) => ApiResponseData<D> | Promise<ApiResponseData<D>> | Promise<void> | void): any;
}

globalThis.createApiError = (statusCode: StatusCode = 500, arg1: any, arg2?: any) => new ApiError(statusCode, arg1, arg2);
globalThis.createApiErrorAndThrow = (statusCode: StatusCode = 500, arg1: any, arg2?: any) => {
	throw createApiError(statusCode, arg1, arg2);
};

globalThis.createApiSuccessResponseData = (arg1: any, arg2?: any) => {
	if (typeof arg1 === 'string') [arg1, arg2] = [arg2, arg1];
	return { data: arg1 || {}, message: arg2 ?? '成功', success: true };
};

globalThis.defineApiHandler = function (handler) {
	return async (ctx: Context) => {
		const data = await handler(ctx);
		if (!data) return ctx.json(createApiSuccessResponseData());
		return ctx.json(data);
	};
};
