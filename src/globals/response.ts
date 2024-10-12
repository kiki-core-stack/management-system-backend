import type { Context } from 'hono';
import type { PaginateOptions, PopulateOptions, QueryOptions } from 'mongoose';

declare global {
	function getModelDocumentByRouteIdAndDelete<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		ctx: Context,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeDelete?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>) => any
	): Promise<void>;

	function getModelDocumentByRouteIdAndUpdateBooleanField<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		ctx: Context,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		allowedFields: string[],
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeUpdate?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>, field: string, value: boolean) => any
	): Promise<void>;

	function modelToPaginatedResponseData<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		ctx: Context,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		paginateOptions?: PaginateOptions,
		filterInFields?: Dict<string>,
		processObjectIdIgnoreFields?: string[]
	): Promise<ApiResponseData<{ count: number; data: any[] }>>;

	function modelToPaginatedResponseData<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		queries: ProcessedApiRequestQueries,
		paginateOptions?: PaginateOptions
	): Promise<ApiResponseData<{ count: number; data: any[] }>>;
}

globalThis.getModelDocumentByRouteIdAndDelete = async (ctx, model, options, beforeDelete) => {
	const document = await model.findByRouteIdOrThrowNotFoundError(ctx, undefined, null, options);
	// @ts-expect-error
	await beforeDelete?.(document);
	await document.deleteOne(options || undefined);
};

globalThis.getModelDocumentByRouteIdAndUpdateBooleanField = async (ctx, model, allowedFields, options, beforeUpdate) => {
	const document = await model.findByRouteIdOrThrowNotFoundError(ctx, undefined, null, options);
	const { field, value } = await ctx.req.json<{ field: string; value: boolean }>();
	if (!allowedFields.includes(field)) throwApiError(400);
	// @ts-expect-error
	await beforeUpdate?.(document, field, !!value);
	// @ts-expect-error
	await document.updateOne({ [`${field}`]: !!value });
};

globalThis.modelToPaginatedResponseData = async <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
	ctxOrModel: Context | BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
	modelOrQueries: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | ProcessedApiRequestQueries,
	paginateOptions?: PaginateOptions,
	filterInFields?: Dict<string>,
	processObjectIdIgnoreFields?: string[]
) => {
	let model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>;
	let queries: ProcessedApiRequestQueries;
	if ('json' in ctxOrModel) {
		// @ts-expect-error
		model = modelOrQueries;
		queries = getProcessedApiRequestQueries(ctxOrModel, filterInFields, processObjectIdIgnoreFields);
	} else {
		model = ctxOrModel;
		// @ts-expect-error
		queries = modelOrQueries;
	}

	if (paginateOptions?.populate && queries.selectFields.length) paginateOptions.populate = [paginateOptions.populate].flat().filter((item) => queries.selectFields.includes(typeof item === 'object' ? item.path : item)) as PopulateOptions[] | string[];
	// @ts-expect-error
	const paginateResult = await model.paginate(queries.filterQuery, {
		...paginateOptions,
		limit: queries.limit,
		page: queries.page,
		select: queries.selectFields,
		sort: paginateOptions?.sort || { _id: -1 }
	});

	return createApiSuccessResponseData({ count: paginateResult.totalDocs, data: paginateResult.docs });
};
