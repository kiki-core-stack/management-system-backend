import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';

import { defaultHonoFactory } from '@/core/constants/hono';
import { paginateModelData } from '@/libs/model';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    return ctx.createApiSuccessResponse(
        await paginateModelData(
            ctx,
            AdminLogModel,
            undefined,
            {
                options: { readPreference: 'secondaryPreferred' },
                populate: {
                    path: 'a',
                    select: [
                        '-_id',
                        'account',
                    ],
                },
            },
        ),
    );
});
