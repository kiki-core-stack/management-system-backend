import { AdminModel } from '@kiki-core-stack/pack/models/admin';

export default defaultHonoFactory.createHandlers(async (ctx) => ctx.createApiSuccessResponse(await modelToPaginatedData(ctx, AdminModel)));
