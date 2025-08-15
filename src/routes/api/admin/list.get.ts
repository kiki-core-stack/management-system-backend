import { AdminModel } from '@kiki-core-stack/pack/models/admin';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'admin.list' } });

export default defaultHonoFactory.createHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        AdminModel,
        undefined,
        {
            populate: {
                path: 'roles',
                select: 'name',
            },
        },
    );
});
