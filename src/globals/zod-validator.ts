import { zValidator as _zValidator } from '@hono/zod-validator';
import { z as _z } from 'zod';

declare global {
	var z: typeof _z;
	var zValidator: typeof _zValidator;
}

globalThis.z = _z;
globalThis.zValidator = _zValidator;
