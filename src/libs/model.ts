import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { assertMongooseUpdateSuccess } from '@kikiutils/mongoose/utils';
import type { Context } from 'hono';
import type {
    FilterQuery,
    PaginateOptions,
    PopulateOptions,
    QueryOptions,
} from 'mongoose';

import { getProcessedApiRequestQueries } from './request';

export async function getModelDocumentByRouteIdAndDelete<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
    ctx: Context,
    model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
    options?: Nullable<QueryOptions<RawDocType>>,
    beforeDelete?: (
        document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>
    ) => any,
) {
    const document = await model.findByRouteIdOrThrowNotFoundError(ctx, undefined, null, options);
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
    options?: Nullable<QueryOptions<RawDocType>>,
    beforeUpdate?: (
        document: MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>,
        field: string,
        value: boolean
    ) => any,
) {
    const document = await model.findByRouteIdOrThrowNotFoundError(ctx, undefined, null, options);
    const {
        field,
        value,
    } = await ctx.req.json<{ field: string; value: boolean }>();
    if (!allowedFields.includes(field)) throwApiError(400);
    // @ts-expect-error Ignore this error.
    await beforeUpdate?.(document, field, !!value);
    // @ts-expect-error Ignore this error.
    await assertMongooseUpdateSuccess(document.updateOne({ [`${field}`]: !!value }));
}

export function modelToPaginatedData<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
    ctx: Context,
    model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
    paginateOptions?: PaginateOptions,
    filterInFields?: Dict<string>,
    processObjectIdIgnoreFields?: string[]
): Promise<{ count: number; list: any[] }>;
export function modelToPaginatedData<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
    model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
    queries: ProcessedApiRequestQueries,
    paginateOptions?: PaginateOptions
): Promise<{ count: number; list: any[] }>;
export async function modelToPaginatedData<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
    ctxOrModel: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | Context,
    modelOrQueries: BaseMongoosePaginateModel<
        RawDocType,
        QueryHelpers,
        InstanceMethodsAndOverrides
    > | ProcessedApiRequestQueries,
    paginateOptions?: PaginateOptions,
    filterInFields?: Dict<string>,
    processObjectIdIgnoreFields?: string[],
) {
    let model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>;
    let queries: ProcessedApiRequestQueries;
    if ('json' in ctxOrModel) {
        // @ts-expect-error Ignore this error.
        model = modelOrQueries;
        queries = getProcessedApiRequestQueries(ctxOrModel, filterInFields, processObjectIdIgnoreFields);
    } else {
        model = ctxOrModel;
        // @ts-expect-error Ignore this error.
        queries = modelOrQueries;
    }

    if (paginateOptions?.populate && queries.selectFields.length) {
        paginateOptions.populate = [paginateOptions.populate].flat().filter((item) => {
            return queries.selectFields.includes(typeof item === 'object' ? item.path : item);
        }) as PopulateOptions[] | string[];
    }

    const paginateResult = await model.paginate(
        queries.filterQuery as FilterQuery<RawDocType>,
        {
            ...paginateOptions,
            limit: queries.limit,
            page: queries.page,
            select: queries.selectFields,
            sort: paginateOptions?.sort || { _id: -1 },
        },
    );

    return {
        count: paginateResult.totalDocs,
        list: paginateResult.docs,
    };
}
