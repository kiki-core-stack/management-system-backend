import type { Context } from 'hono';

export type PartialContextSessionData = Partial<ContextSessionData>;
export type SessionTokenHandler = Readonly<{
	delete(ctx: Context): void;
	get(ctx: Context): string | undefined;
	set(ctx: Context, value: string): void;
}>;

export interface ContextSessionData {}

declare module 'hono' {
	interface Context {
		session: PartialContextSessionData;
	}
}
