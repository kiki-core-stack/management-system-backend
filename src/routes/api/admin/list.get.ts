import { AdminModel } from '@kiki-core-stack/pack/models/admin';

export default defaultHonoFactory.createHandlers(async (ctx) => ctx.createAPISuccessResponse(await modelToPaginatedData(ctx, AdminModel)));
