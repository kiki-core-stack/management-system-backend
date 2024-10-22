import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import { createFactory } from 'hono/factory';
import type { Factory } from 'hono/factory';

declare global {
	const defaultHonoFactory: Factory<{}, '/'>;
}

setReadonlyConstantToGlobalThis('defaultHonoFactory', createFactory());
