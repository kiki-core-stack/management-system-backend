import { AdminModel } from '@kiki-core-stack/pack/models/admin';

import { defaultHonoFactory } from '@/core/constants/hono';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export const routePermission = 'admin.list';

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
