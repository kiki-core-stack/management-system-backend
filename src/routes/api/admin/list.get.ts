import { AdminModel } from '@kiki-core-stack/pack/models/admin';

import { defaultHonoFactory } from '@/core/constants/hono';
import { getAdminPermission } from '@/libs/admin/permission';
import { parseApiRequestQueryParams } from '@/libs/request';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export const routePermission = 'admin.list';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const parsedQueryParams = parseApiRequestQueryParams(ctx);
    if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) parsedQueryParams.filter.isSuperAdmin = false;
    return paginateModelDataWithApiResponse(
        ctx,
        AdminModel,
        parsedQueryParams,
        {
            populate: {
                path: 'roles',
                select: ['name'],
            },
        },
    );
});
