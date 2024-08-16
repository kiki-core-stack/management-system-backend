import type { AdminDocument } from '@kikiutils/el-plus-admin-pack/models';
import type { H3Event } from 'h3';

declare module 'h3' {
	interface H3EventContext {
		admin?: Nullable<AdminDocument>;
	}
}

declare global {
	type H3RequestEvent = H3Event;
}
