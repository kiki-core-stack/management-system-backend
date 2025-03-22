import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

import { getAuthToken } from '@/libs/auth';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const adminSession = await AdminSessionModel.findByRouteIdOrThrowNotFoundError(ctx, { admin: ctx.adminId });
    if (adminSession.token === getAuthToken(ctx)) throwApiError(400);
    await adminSession.deleteOne();
    return ctx.createApiSuccessResponse();
});
