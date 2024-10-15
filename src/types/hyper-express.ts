import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';

declare module '@kikiutils/hyper-express' {
	interface DefaultRequestLocals {
		admin?: Nullable<AdminDocument>;
	}
}

declare module '../core/types/hyper-express' {
	interface RouteHandlerProperties {
		noLoginRequired?: boolean;
	}
}
