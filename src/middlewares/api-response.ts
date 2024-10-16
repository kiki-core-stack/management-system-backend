import type { MiddlewareHandler } from '@kikiutils/hyper-express';

declare module '@kikiutils/hyper-express' {
	interface Response {
		_wrapped_request: Request;
	}
}

export const apiResponseMiddleware = (): MiddlewareHandler => (_, response, next) => {
	next();
	if (!response._wrapped_request.received) sendApiSuccessResponse(response);
};
