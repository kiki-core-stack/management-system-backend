import { AdminModel } from '@kiki-core-stack/pack/models/admin';

import { defaultHonoFactory } from '@/core/constants/hono';
import { paginateModelData } from '@/libs/model';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    return ctx.createApiSuccessResponse(await paginateModelData(ctx, AdminModel));
});
