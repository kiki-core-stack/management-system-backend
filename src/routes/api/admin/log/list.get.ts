import { AdminLogModel } from '@kiki-core-stack/pack/models/admin';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    return ctx.createAPISuccessResponse(
        await modelToPaginatedData(
            ctx,
            AdminLogModel,
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
        ),
    );
});
