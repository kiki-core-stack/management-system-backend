import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import type {
    BaseMongoosePaginateModel,
    MongooseHydratedDocument,
} from '@kikiutils/mongoose/types';
import type { PaginateOptions } from '@kikiutils/mongoose/types/paginate';
import type { Nullable } from '@kikiutils/shared/types';
import type { Context } from 'hono';
import type {
    QueryOptions,
    RootFilterQuery,
} from 'mongoose';

import { parseApiRequestQueryParams } from './request';

export async function getModelDocumentByRouteIdAndDelete<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
    ctx: Context,
    model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
    filter?: RootFilterQuery<RawDocType>,
    options?: Nullable<QueryOptions<RawDocType>>,
    beforeDelete?: (document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>) => any,
) {
    const document = await model.findByRouteIdOrThrowNotFoundError(ctx, filter, undefined, options);
    // @ts-expect-error Ignore this error.
    await beforeDelete?.(document);
    await document.deleteOne(options || undefined);
}

export async function getModelDocumentByRouteIdAndUpdateBooleanField<
    RawDocType,
    QueryHelpers,
    InstanceMethodsAndOverrides,
>(
    ctx: Context,
    model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
    allowedFields: string[],
    filter?: RootFilterQuery<RawDocType>,
    options?: Nullable<QueryOptions<RawDocType>>,
    beforeUpdate?: (
        document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>,
        field: string,
        value: boolean
    ) => any,
) {
    const document = await model.findByRouteIdOrThrowNotFoundError(ctx, filter, undefined, options);
    const { field, value } = await ctx.req.json<{ field: string; value: boolean }>();
    if (!allowedFields.includes(field)) throwApiError(400);
    // @ts-expect-error Ignore this error.
    await beforeUpdate?.(document, field, !!value);
    await document.assertUpdateSuccess({ [`${field}`]: !!value });
}

export async function paginateModelData<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
    ctx: Context,
    model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
    queryParams?: ParsedApiRequestQueryParams,
    paginateOptions?: PaginateOptions,
) {
    if (!queryParams) queryParams = parseApiRequestQueryParams(ctx);
    if (paginateOptions?.populate && queryParams.fields.length) {
        const populates = Array.isArray(paginateOptions.populate)
            ? paginateOptions.populate
            : [paginateOptions.populate];

        paginateOptions.populate = populates.filter(
            (populate) => queryParams.fields.includes(typeof populate === 'object' ? populate.path : populate),
        ) as typeof paginateOptions.populate;
    }

    if (paginateOptions?.select) {
        if (Array.isArray(paginateOptions.select)) queryParams.fields.push(...paginateOptions.select);
        else {
            Object
                .entries(paginateOptions.select)
                .forEach(([key, value]) => queryParams.fields.push(value ? key : `-${key}`));
        }
    }

    let finalSort;
    const rawSort = Object.keys(queryParams.sort).length ? queryParams.sort : paginateOptions?.sort;
    if (rawSort === undefined) finalSort = { _id: -1 };
    else {
        if (typeof rawSort === 'object') {
            finalSort = {
                ...rawSort,
                _id: -1,
            };
        } else if (/\b-?_id\b/.test(rawSort)) finalSort = `${rawSort.trim()} -_id`;
    }

    const paginatedResult = await model.paginate(
        queryParams.filter,
        {
            ...paginateOptions,
            limit: queryParams.limit,
            page: queryParams.page,
            select: queryParams.fields,
            sort: finalSort,
        },
    );

    return {
        count: paginatedResult.totalDocs,
        list: paginatedResult.docs,
    };
}
