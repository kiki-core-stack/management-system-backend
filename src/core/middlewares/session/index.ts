import type { MiddlewareHandler } from '@kikiutils/hyper-express';

import { sessionStorage, sessionTokenSymbol } from './constants';
import type { PartialRequestLocalsSession } from './types';

type StoredData = [number, PartialRequestLocalsSession, ip?: string];

export const sessionMiddleware = async (): Promise<MiddlewareHandler> => {
	await import('./globals');
	return async (request, response) => {
		const token = request.headers['session'];
		let sessionData: PartialRequestLocalsSession | undefined;
		if (token) {
			let storedData: Nullable<StoredData> = null;
			try {
				storedData = await sessionStorage.getItem<StoredData>(token);
			} catch {}
			if (storedData && storedData[0] + 86400000 >= Date.now()) sessionData = storedData[1];
			if (!sessionData) {
				await sessionStorage.removeItem(token);
				response.header('set-session', '', true);
			} else request.locals[sessionTokenSymbol] = token;
		}

		request.locals.session = sessionData || {};
	};
};
