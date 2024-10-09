import type { StatusCode as _StatusCode } from 'hono/utils/http-status';

export type {} from '@kikiutils/kiki-core-stack-pack/types';
export type {} from '@kikiutils/mongoose/types';

declare global {
	type StatusCode = _StatusCode;
}
