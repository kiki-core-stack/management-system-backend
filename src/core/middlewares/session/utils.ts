import type { Request, Response } from '@kikiutils/hyper-express';
import { nanoid } from 'nanoid';

import { sessionClearedSymbol, sessionStorage, sessionTokenSymbol } from './constants';

export const onRequestLocalsSessionUpdate = async (request: Request, response: Response) => {
	if (request.locals[sessionClearedSymbol]) {
		delete request.locals[sessionClearedSymbol];
		if (request.locals[sessionTokenSymbol]) await sessionStorage.removeItem(request.locals[sessionTokenSymbol]);
		response.clearCookie('session');
	} else {
		const toSetToken = request.locals[sessionTokenSymbol] || nanoid(64);
		await sessionStorage.setItem(toSetToken, [Date.now(), request.locals.session], { ttl: 86400 });
		response.setCookie('session', toSetToken, {
			httpOnly: true,
			maxAge: 86400,
			sameSite: 'strict',
			secure: true
		});
	}
};
