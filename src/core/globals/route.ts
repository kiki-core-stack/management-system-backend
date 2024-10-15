// prettier-multiline-arrays-set-threshold: 3

import type { infer as ZodInfer, ZodTypeAny } from 'zod';

import type { MiddlewareHandler, UserRouteHandler } from '@/core/types/hyper-express';

type MiddlewareHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas = {}> = MiddlewareHandler<{
	verifiedData: { [key in keyof Schemas]: Schemas[key] extends ZodTypeAny ? ZodInfer<Schemas[key]> : never };
}>;

type RouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas = {}> = MiddlewareHandler<{
	verifiedData: { [key in keyof Schemas]: Schemas[key] extends ZodTypeAny ? ZodInfer<Schemas[key]> : never };
}>;

type RouteHandlerWithZodValidatorSchemas = Partial<Record<'params' | 'json' | 'query', ZodTypeAny>>;

declare global {
	function defineRouteHandler(handler: UserRouteHandler): [UserRouteHandler];
	function defineRouteHandler(handler: MiddlewareHandler, ...handlers: [...MiddlewareHandler[], UserRouteHandler]): [...MiddlewareHandler[], UserRouteHandler];
	function defineRouteHandler(handlers: [...MiddlewareHandler[], UserRouteHandler]): [...MiddlewareHandler[], UserRouteHandler];

	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(schemas: Schemas, handler: RouteHandlerWithZodValidator<Schemas>): [RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		schemas: Schemas,
		handler: MiddlewareHandlerWithZodValidator<Schemas>,
		...handlers: [...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>]
	): [RouteHandlerWithZodValidator<Schemas>, ...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		schemas: Schemas,
		handlers: [...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>]
	): [RouteHandlerWithZodValidator<Schemas>, ...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>];
}

// @ts-expect-error
globalThis.defineRouteHandler = (...handlers) => handlers.flat();
globalThis.defineRouteHandlerWithZodValidator = (schemas, ...handlers) => [
	async (request) => {
		// @ts-expect-error
		request.locals.verifiedData = {};
		if (schemas.params) request.locals.verifiedData.params = schemas.params.parse(request.params);
		if (schemas.json) request.locals.verifiedData.json = schemas.json.parse(await request.json());
		if (schemas.query) request.locals.verifiedData.query = schemas.query.parse(request.query);
	},
	// @ts-expect-error
	...handlers.flat()
];
