import type { BaseMongoosePaginateModel } from '@kikiutils/mongoose/types';
import type { PaginateOptions } from '@kikiutils/mongoose/types/paginate';
import type { Context } from 'hono';

import { paginateModelData } from './model';

export async function paginateModelDataWithApiResponse<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
    ctx: Context,
    model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
    queryParams?: ParsedApiRequestQueryParams,
    paginateOptions?: PaginateOptions,
) {
    return ctx.createApiSuccessResponse(await paginateModelData(ctx, model, queryParams, paginateOptions));
}
