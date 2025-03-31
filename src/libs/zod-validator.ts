import { zValidator } from '@hono/zod-validator';
import type { Hook } from '@hono/zod-validator';
import type { Env } from 'hono';

const hook: Hook<any, Env, string, any, object> = (result) => {
    if (!result.success) throw result.error;
};

export const apiZValidator = ((target: any, schema: any) => zValidator(target, schema, hook)) as typeof zValidator;
