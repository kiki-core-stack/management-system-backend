import type { Session } from './classes/session';

export type PartialRequestLocalsSession = Partial<RequestLocalsSession>;

export interface RequestLocalsSession {}

declare module '@kikiutils/hyper-express' {
	interface DefaultRequestLocals {
		session: PartialRequestLocalsSession;
	}

	interface Request {
		session: Session;
	}
}
