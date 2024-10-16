import type { Request } from '@kikiutils/hyper-express';
import type { PaginateOptions, PopulateOptions } from 'mongoose';

declare global {
	const modelToPaginatedData: {
		<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
			request: Request,
			model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
			paginateOptions?: PaginateOptions,
			filterInFields?: Dict<string>,
			processObjectIdIgnoreFields?: string[]
		): Promise<any>;

		<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>, queries: ProcessedApiRequestQueries, paginateOptions?: PaginateOptions): Promise<any>;
	};
}

Object.defineProperty(globalThis, 'modelToPaginatedData', {
	configurable: false,
	async value<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		modelOrRequest: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | Request,
		modelOrQueries: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | ProcessedApiRequestQueries,
		paginateOptions?: PaginateOptions,
		filterInFields?: Dict<string>,
		processObjectIdIgnoreFields?: string[]
	) {
		let model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>;
		let queries: ProcessedApiRequestQueries;
		if ('json' in modelOrRequest) {
			// @ts-expect-error
			model = modelOrQueries;
			queries = getProcessedApiRequestQueries(modelOrRequest as Request, filterInFields, processObjectIdIgnoreFields);
		} else {
			model = modelOrRequest;
			// @ts-expect-error
			queries = modelOrQueries;
		}

		if (paginateOptions?.populate && queries.selectFields.length) paginateOptions.populate = [paginateOptions.populate].flat().filter((item) => queries.selectFields.includes(typeof item === 'object' ? item.path : item)) as PopulateOptions[] | string[];
		const paginateResult = await model.paginate(queries.filterQuery, {
			...paginateOptions,
			limit: queries.limit,
			page: queries.page,
			select: queries.selectFields,
			sort: paginateOptions?.sort || { _id: -1 }
		});

		return { count: paginateResult.totalDocs, data: paginateResult.docs };
	},
	writable: false
});
