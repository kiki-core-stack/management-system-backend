import type { StatusCode } from 'hono/utils/http-status';

import { statusCodeToMessageMap } from '../../constants/response';

declare global {
	type ApiError<D extends object = any> = _ApiError<D>;

	var ApiError: typeof _ApiError;
}

class _ApiError<D extends object> extends Error {
	data: D;
	statusCode: StatusCode;

	constructor(statusCode?: StatusCode, data?: D, message?: string);
	constructor(statusCode?: StatusCode, message?: string, data?: D);
	constructor(statusCode: StatusCode = 500, arg1: any, arg2?: any) {
		if (typeof arg1 === 'string') [arg1, arg2] = [arg2, arg1];
		super(JSON.stringify({ data: arg1 || {}, message: arg2 ?? (statusCodeToMessageMap[statusCode] || '系統錯誤！'), success: false }));
		this.data = arg1;
		this.statusCode = statusCode;
		Error.captureStackTrace?.(this, this.constructor);
	}
}

globalThis.ApiError = _ApiError;
