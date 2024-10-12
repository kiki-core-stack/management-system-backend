import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineApiRouteHandler(async (ctx) => await modelToPaginatedResponseData(ctx, AdminModel));
