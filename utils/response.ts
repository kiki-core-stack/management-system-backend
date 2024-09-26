import { escapeRegExp } from 'lodash-es';
import { Types } from 'mongoose';
import type { PaginateOptions, PopulateOptions, QueryOptions } from 'mongoose';

const baseFilterInFields = { states: 'state', types: 'type' } as const;
export const getModelDocumentByRouteIdAndDelete = async <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
	event: H3RequestEvent,
	model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
	options?: Nullable<QueryOptions<RawDocType>>,
	beforeDelete?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>) => any
) => {
	const document = await model.findByRouteIdOrThrowNotFoundError(event, null, options);
	// @ts-expect-error
	await beforeDelete?.(document);
	await document.deleteOne(options || undefined);
	return createApiSuccessResponseData();
};

export const getModelDocumentByRouteIdAndUpdateBooleanField = async <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
	event: H3RequestEvent,
	model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
	allowedFields: string[],
	options?: Nullable<QueryOptions<RawDocType>>,
	beforeUpdate?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>, field: string, value: boolean) => any
) => {
	const document = await model.findByRouteIdOrThrowNotFoundError(event, null, options);
	const { field, value } = await readBody<{ field: string; value: boolean }>(event);
	if (!allowedFields.includes(field)) createApiErrorAndThrow(400);
	// @ts-expect-error
	await beforeUpdate?.(document, field, !!value);
	// @ts-expect-error
	await document.updateOne({ [`${field}`]: !!value });
	return createApiSuccessResponseData();
};

export const getModelToPaginatedResponseDataProcessedQueries = (event: H3RequestEvent, filterInFields?: Dict<string>, processObjectIdIgnoreFields?: string[]): ProcessedApiRequestQueries => {
	let filterQuery: Dict<any> = {};
	let selectFields: Nullable<Set<string>> = null;
	const queries = getQuery<{
		filterQuery?: string;
		limit?: string;
		page?: string;
		selectFields?: string;
	}>(event);

	// TODO: 資料驗證
	if (queries.filterQuery) {
		let filterQueryData = JSON.parse(queries.filterQuery);
		if (filterQueryData.endAt) merge(filterQuery, { createdAt: { $lt: new Date(filterQueryData.endAt) } });
		if (filterQueryData.startAt) merge(filterQuery, { createdAt: { $gte: new Date(filterQueryData.startAt) } });
		Object.entries((filterQueryData = omit(filterQueryData, 'endAt', 'startAt'))).forEach(([key, value]) => {
			if (key.endsWith('Id') && !processObjectIdIgnoreFields?.includes(key) && delete filterQueryData[key]) filterQuery[key.slice(0, -2)] = processMaybeObjectIdValue(value);
			if (key.endsWith('Ids') && !filterInFields?.[key] && delete filterQueryData[key] && Array.isArray(value) && value.length) merge(filterQuery, { [key.slice(0, -3)]: { $in: processMaybeObjectIdArray(value) } });
			if (value?.$regex !== undefined && delete filterQueryData[key] && value.$regex) filterQuery[key] = ((value.$regex = processRegexString(value.$regex)), value);
			Object.entries({ ...baseFilterInFields, ...filterInFields }).forEach(([toCheckField, filterField]) => {
				if (key === toCheckField && delete filterQueryData[toCheckField] && Array.isArray(value) && value.length) merge(filterQuery, { [filterField]: { $in: processMaybeObjectIdArray(value) } });
			});
		});

		merge(filterQuery, filterQueryData);
	}

	if (queries.selectFields) selectFields = new Set(JSON.parse(queries.selectFields));
	const limit = Math.min(+(queries.limit || 10) || 10, 1000);
	const page = +(queries.page || 1) || 1;
	const offset = limit * page;
	return {
		filterQuery,
		limit,
		offset,
		page,
		selectFields: [...(selectFields || [])],
		skip: (page - 1) * limit
	};
};

export const queriesAndModelToPaginatedResponseData = async <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
	model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
	queries: ProcessedApiRequestQueries,
	paginateOptions?: PaginateOptions
) => {
	if (paginateOptions?.populate && queries.selectFields.length) paginateOptions.populate = [paginateOptions.populate].flat().filter((item) => queries.selectFields.includes(typeof item === 'object' ? item.path : item)) as PopulateOptions[] | string[];
	const paginateResult = await model.paginate(queries.filterQuery, {
		...paginateOptions,
		limit: queries.limit,
		page: queries.page,
		select: queries.selectFields,
		sort: paginateOptions?.sort || { _id: -1 }
	});

	return createApiSuccessResponseData({ count: paginateResult.totalDocs, data: paginateResult.docs });
};

export const modelToPaginatedResponseData = async <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
	event: H3RequestEvent,
	model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
	paginateOptions?: PaginateOptions,
	filterInFields?: Dict<string>,
	processObjectIdIgnoreFields?: string[]
) => await queriesAndModelToPaginatedResponseData(model, getModelToPaginatedResponseDataProcessedQueries(event, filterInFields, processObjectIdIgnoreFields), paginateOptions);
const processMaybeObjectIdArray = (array: any[]) => array.map((item) => processMaybeObjectIdValue(item));
const processMaybeObjectIdValue = (value: any) => (typeof value === 'string' && Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : value);
function processRegexString(value: string) {
	try {
		new RegExp(value);
		return value;
	} catch {
		return escapeRegExp(value);
	}
}
