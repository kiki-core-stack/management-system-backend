import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { Context } from 'hono';
import type { FilterQuery, QueryOptions, PaginateOptions, PopulateOptions } from 'mongoose';

declare global {
	const getModelDocumentByRouteIdAndDelete: <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		ctx: Context,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeDelete?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>) => any
	) => Promise<void>;

	const getModelDocumentByRouteIdAndUpdateBooleanField: <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		ctx: Context,
		model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		allowedFields: string[],
		options?: Nullable<QueryOptions<RawDocType>>,
		beforeUpdate?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>, field: string, value: boolean) => any
	) => Promise<void>;

	const modelToPaginatedData: {
		<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
			ctx: Context,
			model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
			paginateOptions?: PaginateOptions,
			filterInFields?: Dict<string>,
			processObjectIdIgnoreFields?: string[]
		): Promise<any>;

		<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>, queries: ProcessedAPIRequestQueries, paginateOptions?: PaginateOptions): Promise<any>;
	};
}

setReadonlyConstantToGlobalThis<typeof getModelDocumentByRouteIdAndDelete>('getModelDocumentByRouteIdAndDelete', async (ctx, model, options, beforeDelete) => {
	const document = await model.findByRouteIdOrThrowNotFoundError(ctx, undefined, null, options);
	// @ts-expect-error
	await beforeDelete?.(document);
	await document.deleteOne(options || undefined);
});

setReadonlyConstantToGlobalThis<typeof getModelDocumentByRouteIdAndUpdateBooleanField>('getModelDocumentByRouteIdAndUpdateBooleanField', async (ctx, model, allowedFields, options, beforeUpdate) => {
	const document = await model.findByRouteIdOrThrowNotFoundError(ctx, undefined, null, options);
	const { field, value } = await ctx.req.json<{ field: string; value: boolean }>();
	if (!allowedFields.includes(field)) throwAPIError(400);
	// @ts-expect-error
	await beforeUpdate?.(document, field, !!value);
	// @ts-expect-error
	await document.updateOne({ [`${field}`]: !!value });
});

setReadonlyConstantToGlobalThis<typeof modelToPaginatedData>(
	'modelToPaginatedData',
	async <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		ctxOrModel: Context | BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
		modelOrQueries: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | ProcessedAPIRequestQueries,
		paginateOptions?: PaginateOptions,
		filterInFields?: Dict<string>,
		processObjectIdIgnoreFields?: string[]
	) => {
		let model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>;
		let queries: ProcessedAPIRequestQueries;
		if ('json' in ctxOrModel) {
			// @ts-expect-error
			model = modelOrQueries;
			queries = getProcessedAPIRequestQueries(ctxOrModel, filterInFields, processObjectIdIgnoreFields);
		} else {
			model = ctxOrModel;
			// @ts-expect-error
			queries = modelOrQueries;
		}

		if (paginateOptions?.populate && queries.selectFields.length) paginateOptions.populate = [paginateOptions.populate].flat().filter((item) => queries.selectFields.includes(typeof item === 'object' ? item.path : item)) as PopulateOptions[] | string[];
		const paginateResult = await model.paginate(queries.filterQuery as FilterQuery<RawDocType>, {
			...paginateOptions,
			limit: queries.limit,
			page: queries.page,
			select: queries.selectFields,
			sort: paginateOptions?.sort || { _id: -1 }
		});

		return { count: paginateResult.totalDocs, data: paginateResult.docs };
	}
);
