// prettier-multiline-arrays-set-threshold: 3

import type { infer as ZodInfer, ZodTypeAny } from 'zod';

import type { MiddlewareHandler } from '@/core/types/hyper-express';

type RouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas = {}> = MiddlewareHandler<{
	verifiedData: { [key in keyof Schemas]: Schemas[key] extends ZodTypeAny ? ZodInfer<Schemas[key]> : never };
}>;

type RouteHandlerWithZodValidatorSchemas = Partial<Record<'params' | 'json' | 'query', ZodTypeAny>>;

declare global {
	function defineRouteHandler(handler: MiddlewareHandler): MiddlewareHandler[];
	function defineRouteHandler(handler: MiddlewareHandler, ...handlers: MiddlewareHandler[]): MiddlewareHandler[];
	function defineRouteHandler(handlers: MiddlewareHandler[]): MiddlewareHandler[];

	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(schemas: Schemas, handler: RouteHandlerWithZodValidator<Schemas>): RouteHandlerWithZodValidator<Schemas>[];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		schemas: Schemas,
		handler: RouteHandlerWithZodValidator<Schemas>,
		...handlers: RouteHandlerWithZodValidator<Schemas>[]
	): RouteHandlerWithZodValidator<Schemas>[];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(schemas: Schemas, handlers: RouteHandlerWithZodValidator<Schemas>[]): RouteHandlerWithZodValidator<Schemas>[];
}

globalThis.defineRouteHandler = (...handlers) => handlers.flat() as MiddlewareHandler[];
globalThis.defineRouteHandlerWithZodValidator = (schemas, ...handlers) => [
	(request, _, next) => {
		// @ts-expect-error
		request.locals.verifiedData = {};
		if (schemas.params) request.locals.verifiedData.params = schemas.params.parse(request.params);
		if (schemas.json) request.locals.verifiedData.json = schemas.json.parse(request.json());
		if (schemas.query) request.locals.verifiedData.query = schemas.query.parse(request.query);
		next();
	},
	...(handlers.flat() as RouteHandlerWithZodValidator[])
];
