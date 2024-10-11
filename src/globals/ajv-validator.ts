import { ajvValidator } from '@kikiutils/kiki-core-stack-pack/constants/ajv-validator';
import type { JSONSchemaType } from 'ajv';
import type { Context } from 'hono';

export const compileHonoRequestDataAjvValidator = <T>(schema: JSONSchemaType<T>, isQuery: boolean = false) => {
	const validator = ajvValidator.compile(schema);
	return async (ctx: Context) => {
		let data;
		if (isQuery) data = ctx.req.query();
		else data = ctx.req.header('content-type') === 'application/json' ? await ctx.req.json() : await ctx.req.parseBody();
		if (!validator(data)) createApiErrorAndThrow(400);
		return data;
	};
};
