import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defaultHonoFactory.createHandlers(async (ctx) => ctx.createAPISuccessResponse(await modelToPaginatedData(ctx, AdminModel)));
