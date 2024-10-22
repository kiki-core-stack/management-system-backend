import type { Context } from 'hono';

import type { sessionChangedSymbol, sessionClearedSymbol } from './constants';

export type PartialContextSessionData = Partial<ContextSessionData>;
export type SessionTokenHandler = Readonly<{
	delete(ctx: Context): void;
	get(ctx: Context): string | undefined;
	set(ctx: Context, value: string): void;
}>;

export interface ContextSessionData {}

declare module 'hono' {
	interface Context {
		[sessionChangedSymbol]?: true;
		[sessionClearedSymbol]?: true;
		clearSession(): void;
		popSession<K extends keyof ContextSessionData>(key: K): ContextSessionData[K] | undefined;
		session: PartialContextSessionData;
	}
}
