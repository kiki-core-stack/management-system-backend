import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';

declare module 'hono' {
	interface Context {
		admin?: Nullable<AdminDocument>;
	}
}
