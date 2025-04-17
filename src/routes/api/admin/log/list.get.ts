import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';

import { defaultHonoFactory } from '@/core/constants/hono';
import { modelToPaginatedData } from '@/libs/model';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    return ctx.createApiSuccessResponse(
        await modelToPaginatedData(
            ctx,
            AdminLogModel,
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
