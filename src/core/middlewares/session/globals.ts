import type { Request, Response } from '@kikiutils/hyper-express';

import { sessionClearedSymbol, sessionStorage, sessionTokenSymbol } from './constants';
import type { PartialRequestLocalsSession } from './types';
import { onRequestLocalsSessionUpdate } from './utils';

declare global {
	function clearRequestLocalsSession(request: Request, response: Response): Promise<void>;
	function deleteRequestLocalsSessionStorageData(token: string): Promise<void>;
	function getRequestLocalsSessionToken(request: Request): string | undefined;
	function popRequestLocalsSession<K extends keyof PartialRequestLocalsSession>(request: Request, response: Response, key: K): Promise<PartialRequestLocalsSession[K]>;
	function setRequestLocalsSession<K extends keyof PartialRequestLocalsSession>(request: Request, response: Response, key: K, value: PartialRequestLocalsSession[K]): Promise<void>;
}

globalThis.clearRequestLocalsSession = async (request, response) => {
	request.locals[sessionClearedSymbol] = true;
	request.locals.session = {};
	await onRequestLocalsSessionUpdate(request, response);
};

globalThis.deleteRequestLocalsSessionStorageData = async (token) => await sessionStorage.removeItem(token);
globalThis.getRequestLocalsSessionToken = (request) => request.locals[sessionTokenSymbol];
globalThis.popRequestLocalsSession = async (request, response, key) => {
	const value = request.locals.session[key];
	delete request.locals.session[key];
	await onRequestLocalsSessionUpdate(request, response);
	return value;
};

globalThis.setRequestLocalsSession = async (request, response, key, value) => {
	request.locals.session[key] = value;
	await onRequestLocalsSessionUpdate(request, response);
};
