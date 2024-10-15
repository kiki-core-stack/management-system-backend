// prettier-multiline-arrays-set-threshold: 3

import type { infer as ZodInfer, ZodTypeAny } from 'zod';

import type { MiddlewareHandler, RouteHandlerOptions } from '@/core/types/hyper-express';

type RouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas = {}> = MiddlewareHandler<{
	verifiedData: { [key in keyof Schemas]: Schemas[key] extends ZodTypeAny ? ZodInfer<Schemas[key]> : never };
}>;

type RouteHandlerWithZodValidatorSchemas = Partial<Record<'params' | 'json' | 'query', ZodTypeAny>>;

declare global {
	function defineRouteHandler(handler: MiddlewareHandler): [MiddlewareHandler];
	function defineRouteHandler(handler: MiddlewareHandler, ...handlers: MiddlewareHandler[]): [MiddlewareHandler, ...MiddlewareHandler[]];
	function defineRouteHandler(handlers: [MiddlewareHandler, ...MiddlewareHandler[]]): [MiddlewareHandler, ...MiddlewareHandler[]];
	function defineRouteHandler(options: RouteHandlerOptions, handler: MiddlewareHandler): [RouteHandlerOptions, MiddlewareHandler];
	function defineRouteHandler(options: RouteHandlerOptions, handler: MiddlewareHandler, ...handlers: MiddlewareHandler[]): [RouteHandlerOptions, MiddlewareHandler, ...MiddlewareHandler[]];
	function defineRouteHandler(options: RouteHandlerOptions, handlers: [MiddlewareHandler, ...MiddlewareHandler[]]): [RouteHandlerOptions, MiddlewareHandler, ...MiddlewareHandler[]];

	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(schemas: Schemas, handler: RouteHandlerWithZodValidator<Schemas>): [RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		schemas: Schemas,
		handler: RouteHandlerWithZodValidator<Schemas>,
		...handlers: RouteHandlerWithZodValidator<Schemas>[]
	): [RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>, ...RouteHandlerWithZodValidator<Schemas>[]];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		options: RouteHandlerOptions,
		schemas: Schemas,
		handlers: [RouteHandlerWithZodValidator<Schemas>, ...RouteHandlerWithZodValidator<Schemas>[]]
	): [RouteHandlerOptions, RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>, ...RouteHandlerWithZodValidator<Schemas>[]];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(schemas: Schemas, handler: RouteHandlerWithZodValidator<Schemas>): [RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		options: RouteHandlerOptions,
		schemas: Schemas,
		handler: RouteHandlerWithZodValidator<Schemas>,
		...handlers: RouteHandlerWithZodValidator<Schemas>[]
	): [RouteHandlerOptions, RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>, ...RouteHandlerWithZodValidator<Schemas>[]];
	function defineRouteHandlerWithZodValidator<Schemas extends RouteHandlerWithZodValidatorSchemas>(
		options: RouteHandlerOptions,
		schemas: Schemas,
		handlers: [RouteHandlerWithZodValidator<Schemas>, ...RouteHandlerWithZodValidator<Schemas>[]]
	): [RouteHandlerOptions, RouteHandlerWithZodValidator<Schemas>, RouteHandlerWithZodValidator<Schemas>, ...RouteHandlerWithZodValidator<Schemas>[]];
}

// @ts-expect-error
globalThis.defineRouteHandler = (...args: [MiddlewareHandler, ...MiddlewareHandler[]] | [RouteHandlerOptions, MiddlewareHandler, ...MiddlewareHandler[]]) => {
	if (typeof args[0] === 'object') {
		Object.assign(args.at(-1)!, args[0].properties);
		delete args[0].properties;
	}

	return args.flat();
};

// @ts-expect-error
globalThis.defineRouteHandlerWithZodValidator = (...args) => {
	let options = args[0] as RouteHandlerOptions;
	let schemas = args[0] as RouteHandlerWithZodValidatorSchemas;
	if (typeof args[1] === 'object') {
		Object.assign(args.at(-1)!, options.properties);
		delete options.properties;
		schemas = args[1];
	}

	return [
		options,
		async (request) => {
			// @ts-expect-error
			request.locals.verifiedData = {};
			if (schemas.params) request.locals.verifiedData.params = schemas.params.parse(request.params);
			if (schemas.json) request.locals.verifiedData.json = schemas.json.parse(await request.json());
			if (schemas.query) request.locals.verifiedData.query = schemas.query.parse(request.query);
		},
		...args.slice(2).flat()
	];
};
