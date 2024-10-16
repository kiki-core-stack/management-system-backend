import type { MiddlewareHandler } from '@kikiutils/hyper-express';

import Session from './classes/session';

export const sessionMiddleware = (): MiddlewareHandler => {
	return async (request, response) => {
		request.session = new Session(request, response);
		await request.session.init();
	};
};
