import { AdminModel } from '@kiki-core-stack/pack/models/admin';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    return ctx.createApiSuccessResponse(await modelToPaginatedData(ctx, AdminModel));
});
