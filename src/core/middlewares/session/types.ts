export type PartialContextSessionData = Partial<ContextSessionData>;

export interface ContextSessionData {}

declare module 'hono' {
	interface Context {
		session: PartialContextSessionData;
	}
}
