import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defaultHonoFactory.createHandlers(async (ctx) => ctx.json(createAPISuccessResponseData(await modelToPaginatedData(ctx, AdminModel))));
