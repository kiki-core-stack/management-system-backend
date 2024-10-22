import type { Context } from 'hono';
import onChange from 'on-change';

import { sessionChangedSymbol, sessionClearedSymbol } from './constants';
import type { ContextSessionData } from './types';

export function clearSession() {
	// @ts-expect-error
	const self: Context = this;
	onChange.unsubscribe(self.session);
	self[sessionClearedSymbol] = true;
	self.session = onChange(
		{},
		() => {
			onChange.unsubscribe(self.session);
			delete self[sessionClearedSymbol];
			self[sessionChangedSymbol] = true;
		},
		{ ignoreSymbols: true }
	);
}

export function popSession<K extends keyof ContextSessionData>(key: K) {
	// @ts-expect-error
	const self: Context = this;
	const value = self.session[key];
	if (value !== undefined) delete self.session[key];
	return value;
}
