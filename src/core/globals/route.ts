// prettier-multiline-arrays-set-threshold: 3

import type { infer as ZodInfer, ZodTypeAny } from 'zod';

import type { MiddlewareHandler, RouteHandlerOptions, UserRouteHandler } from '@/core/types/hyper-express';

type MiddlewareHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas = {}> = MiddlewareHandler<{
	verifiedData: { [key in keyof Schemas]: Schemas[key] extends ZodTypeAny ? ZodInfer<Schemas[key]> : never };
}>;

type RouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas = {}> = MiddlewareHandler<{
	verifiedData: { [key in keyof Schemas]: Schemas[key] extends ZodTypeAny ? ZodInfer<Schemas[key]> : never };
}>;

type RouteHandlerWithZodValidatorSchemas = Partial<Record<'params' | 'json' | 'query', ZodTypeAny>>;

declare global {
	function defineRouteHandler(options: RouteHandlerOptions, handler: UserRouteHandler): [RouteHandlerOptions, UserRouteHandler];
	function defineRouteHandler(options: RouteHandlerOptions, handler: MiddlewareHandler, ...handlers: [...MiddlewareHandler[], UserRouteHandler]): [RouteHandlerOptions, ...MiddlewareHandler[], UserRouteHandler];
	function defineRouteHandler(options: RouteHandlerOptions, handlers: [...MiddlewareHandler[], UserRouteHandler]): [RouteHandlerOptions, ...MiddlewareHandler[], UserRouteHandler];
	function defineRouteHandler(handler: UserRouteHandler): [UserRouteHandler];
	function defineRouteHandler(handler: MiddlewareHandler, ...handlers: [...MiddlewareHandler[], UserRouteHandler]): [...MiddlewareHandler[], UserRouteHandler];
	function defineRouteHandler(handlers: [...MiddlewareHandler[], UserRouteHandler]): [...MiddlewareHandler[], UserRouteHandler];

	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		options: RouteHandlerOptions,
		schemas: Schemas,
		handler: RouteHandlerWithZodValidator<Schemas>
	): [RouteHandlerOptions, RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		options: RouteHandlerOptions,
		schemas: Schemas,
		handler: MiddlewareHandlerWithZodValidator<Schemas>,
		...handlers: [...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>]
	): [RouteHandlerOptions, RouteHandlerWithZodValidator<Schemas>, ...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		options: RouteHandlerOptions,
		schemas: Schemas,
		handlers: [...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>]
	): [RouteHandlerOptions, RouteHandlerWithZodValidator<Schemas>, ...MiddlewareHandlerWithZodValidator<Schemas>[], RouteHandlerWithZodValidator<Schemas>];
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
globalThis.defineRouteHandler = (...args: [MiddlewareHandler, ...MiddlewareHandler[]] | [RouteHandlerOptions, MiddlewareHandler, ...MiddlewareHandler[]]) => {
	if (typeof args[0] === 'object') Object.assign(args.at(-1)!, args[0].properties), delete args[0].properties;
	return args.flat();
};

// @ts-expect-error
globalThis.defineRouteHandlerWithZodValidator = (...args) => {
	const results = [];
	if (typeof args[1] === 'object') {
		results.push(args.shift() as RouteHandlerOptions);
		Object.assign(args.at(-1)!, results[0]!.properties);
		delete results[0]!.properties;
	}

	const schemas = args.shift() as RouteHandlerWithZodValidatorSchemas;
	return [
		...results,
		async (request: any) => {
			request.locals.verifiedData = {};
			if (schemas.params) request.locals.verifiedData.params = schemas.params.parse(request.params);
			if (schemas.json) request.locals.verifiedData.json = schemas.json.parse(await request.json());
			if (schemas.query) request.locals.verifiedData.query = schemas.query.parse(request.query);
		},
		...args.flat()
	];
};
