import type { sessionClearedSymbol, sessionTokenSymbol } from './constants';

export type PartialRequestLocalsSession = Partial<RequestLocalsSession>;

export interface RequestLocalsSession {}

declare module '@kikiutils/hyper-express' {
	interface DefaultRequestLocals {
		[sessionClearedSymbol]?: true;
		[sessionTokenSymbol]?: string;
		session: PartialRequestLocalsSession;
	}
}
