import type { Request, Response } from '@kikiutils/hyper-express';
import type { PaginateOptions, QueryOptions } from 'mongoose';

declare global {
	const getModelDocumentByRouteIdAndDelete: <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		request: Request,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeDelete?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>) => any
	) => Promise<void>;

	const getModelDocumentByRouteIdAndUpdateBooleanField: <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		request: Request,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		allowedFields: string[],
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeUpdate?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>, field: string, value: boolean) => any
	) => Promise<void>;

	const sendPaginatedModelDataResponse: {
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
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeDelete?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>) => any
	) {
		const document = await model.findByRouteIdOrThrowNotFoundError(request, undefined, null, options);
		// @ts-expect-error
		await beforeDelete?.(document);
		await document.deleteOne(options || undefined);
	},
	writable: false
});

Object.defineProperty(globalThis, 'getModelDocumentByRouteIdAndUpdateBooleanField', {
	configurable: false,
	async value<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		request: Request,
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
	},
	writable: false
});

Object.defineProperty(globalThis, 'sendPaginatedModelDataResponse', {
	configurable: false,
	async value<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		requestOrResponse: Request | Response,
		modelOrResponse: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | Response,
		modelOrQueries: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | ProcessedApiRequestQueries,
		paginateOptions?: PaginateOptions,
		filterInFields?: Dict<string>,
		processObjectIdIgnoreFields?: string[]
	) {
		let paginatedData;
		let response = requestOrResponse;
		if ('json' in modelOrResponse) {
			paginatedData = await modelToPaginatedData(requestOrResponse as Request, modelOrQueries as BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>, paginateOptions, filterInFields, processObjectIdIgnoreFields);
			response = modelOrResponse;
		} else {
			paginatedData = await modelToPaginatedData(modelOrResponse as BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>, modelOrQueries as ProcessedApiRequestQueries, paginateOptions);
		}

		sendApiSuccessResponse(response as Response, paginatedData);
	},
	writable: false
});
