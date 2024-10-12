import { zValidator as _zValidator } from '@hono/zod-validator';

declare global {
	var zValidator: typeof _zValidator;
}

globalThis.zValidator = _zValidator;
