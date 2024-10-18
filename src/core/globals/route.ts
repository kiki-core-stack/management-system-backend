// prettier-multiline-arrays-set-threshold: 3

import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { infer as ZodInfer, ZodTypeAny } from 'zod';

import type { MiddlewareHandler, RouteHandlerOptions, UserRouteHandler } from '@/core/types/hyper-express';

type MiddlewareHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas = {}> = MiddlewareHandler<{
	verifiedData: { [key in keyof Schemas]: Schemas[key] extends ZodTypeAny ? ZodInfer<Schemas[key]> : never };
}>;

type RouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas = {}> = UserRouteHandler<{
	verifiedData: { [key in keyof Schemas]: Schemas[key] extends ZodTypeAny ? ZodInfer<Schemas[key]> : never };
}>;

type RouteHandlerWithZodValidatorSchemas = PartialRecord<'params' | 'json' | 'query', ZodTypeAny>;

declare global {
	const defineRouteHandler: {
		(handler: UserRouteHandler): [UserRouteHandler];
		(handler: MiddlewareHandler, ...handlers: [...MiddlewareHandler[], UserRouteHandler]): [...MiddlewareHandler[], UserRouteHandler];
		(handlers: [...MiddlewareHandler[], UserRouteHandler]): [...MiddlewareHandler[], UserRouteHandler];
	};

	const defineRouteHandlerOptions: (options: RouteHandlerOptions) => RouteHandlerOptions;

	const defineRouteHandlerWithZodValidator: {
		<Schemas extends RouteHandlerWithZodValidatorSchemas>(schemas: Schemas, handler: RouteHandlerWithZodValidator<Schemas>): [RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>];
		<Schemas extends RouteHandlerWithZodValidatorSchemas>(
			schemas: Schemas,
			handler: MiddlewareHandlerWithZodValidator<Schemas>,
			...handlers: [...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>]
		): [RouteHandlerWithZodValidator<Schemas>, ...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>];
		<Schemas extends RouteHandlerWithZodValidatorSchemas>(
			schemas: Schemas,
			handlers: [...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>]
		): [RouteHandlerWithZodValidator<Schemas>, ...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>];
	};
}

setReadonlyConstantToGlobalThis('defineRouteHandler', (...handlers: (MiddlewareHandler | UserRouteHandler)[]) => handlers.flat());
setReadonlyConstantToGlobalThis('defineRouteHandlerOptions', (options: RouteHandlerOptions) => options);
setReadonlyConstantToGlobalThis('defineRouteHandlerWithZodValidator', <Schemas extends RouteHandlerWithZodValidatorSchemas>(schemas: Schemas, ...handlers: (MiddlewareHandler | UserRouteHandler)[]) => [
	async (request: Parameters<RouteHandlerWithZodValidator<Schemas>>[0]) => {
		// @ts-expect-error
		request.locals.verifiedData = {};
		if (schemas.params) request.locals.verifiedData.params = schemas.params.parse(request.params);
		if (schemas.json) request.locals.verifiedData.json = schemas.json.parse(await request.json());
		if (schemas.query) request.locals.verifiedData.query = schemas.query.parse(request.query);
	},
	...handlers.flat()
]);
