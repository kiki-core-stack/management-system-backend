import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'admin.log.list' } });

export default defaultHonoFactory.createHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        AdminLogModel,
        undefined,
        {
            options: { readPreference: 'secondaryPreferred' },
            populate: {
                path: 'admin',
                select: [
                    '-_id',
                    'account',
                ],
            },
        },
    );
});
