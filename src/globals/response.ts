import type { Request, Response } from '@kikiutils/hyper-express';
import type { PaginateOptions, PopulateOptions, QueryOptions } from 'mongoose';

declare global {
	const getModelDocumentByRouteIdAndDelete: <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		request: Request,
		response: Response,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeDelete?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>) => any
	) => Promise<void>;

	const getModelDocumentByRouteIdAndUpdateBooleanField: <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		request: Request,
		response: Response,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		allowedFields: string[],
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeUpdate?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>, field: string, value: boolean) => any
	) => Promise<void>;

	const sendModelToPaginatedResponse: {
		<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
			request: Request,
			response: Response,
			model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
			paginateOptions?: PaginateOptions,
			filterInFields?: Dict<string>,
			processObjectIdIgnoreFields?: string[]
		): Promise<void>;

		<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
			response: Response,
			model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
			queries: ProcessedApiRequestQueries,
			paginateOptions?: PaginateOptions
		): Promise<void>;
	};
}

Object.defineProperty(globalThis, 'getModelDocumentByRouteIdAndDelete', {
	configurable: false,
	async value<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		request: Request,
		response: Response,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeDelete?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>) => any
	) {
		const document = await model.findByRouteIdOrThrowNotFoundError(request, undefined, null, options);
		// @ts-expect-error
		await beforeDelete?.(document);
		await document.deleteOne(options || undefined);
		sendApiSuccessResponse(response);
	},
	writable: false
});

Object.defineProperty(globalThis, 'getModelDocumentByRouteIdAndUpdateBooleanField', {
	configurable: false,
	async value<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		request: Request,
		response: Response,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		allowedFields: string[],
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeUpdate?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>, field: string, value: boolean) => any
	) {
		const document = await model.findByRouteIdOrThrowNotFoundError(request, undefined, null, options);
		const { field, value } = await request.json<{ field: string; value: boolean }>();
		if (!allowedFields.includes(field)) throwApiError(400);
		// @ts-expect-error
		await beforeUpdate?.(document, field, !!value);
		// @ts-expect-error
		await document.updateOne({ [`${field}`]: !!value });
		sendApiSuccessResponse(response);
	},
	writable: false
});

Object.defineProperty(globalThis, 'sendModelToPaginatedResponse', {
	configurable: false,
	async value<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		requestOrResponse: Request | Response,
		modelOrResponse: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | Response,
		modelOrQueries: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | ProcessedApiRequestQueries,
		paginateOptions?: PaginateOptions,
		filterInFields?: Dict<string>,
		processObjectIdIgnoreFields?: string[]
	) {
		let model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>;
		let queries: ProcessedApiRequestQueries;
		let response: Response;
		if ('json' in modelOrResponse) {
			// @ts-expect-error
			model = modelOrQueries;
			queries = getProcessedApiRequestQueries(requestOrResponse as Request, filterInFields, processObjectIdIgnoreFields);
			response = modelOrResponse;
		} else {
			model = modelOrResponse;
			// @ts-expect-error
			queries = modelOrQueries;
			// @ts-expect-error
			response = requestOrResponse;
		}

		if (paginateOptions?.populate && queries.selectFields.length) paginateOptions.populate = [paginateOptions.populate].flat().filter((item) => queries.selectFields.includes(typeof item === 'object' ? item.path : item)) as PopulateOptions[] | string[];
		const paginateResult = await model.paginate(queries.filterQuery, {
			...paginateOptions,
			limit: queries.limit,
			page: queries.page,
			select: queries.selectFields,
			sort: paginateOptions?.sort || { _id: -1 }
		});

		sendApiSuccessResponse(response, { count: paginateResult.totalDocs, data: paginateResult.docs });
	},
	writable: false
});
