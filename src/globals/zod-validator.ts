import type { Hook } from '@hono/zod-validator';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { Env } from 'hono';

declare global {
	const apiZValidator: typeof zValidator;
}

const hook: Hook<any, Env, string, any, object> = (result) => {
	if (!result.success) throw result.error;
};

setReadonlyConstantToGlobalThis('apiZValidator', (target: any, schema: any) => zValidator(target, schema, hook));
