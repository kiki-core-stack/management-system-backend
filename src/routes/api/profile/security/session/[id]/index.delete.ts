import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

import { defaultHonoFactory } from '@/core/constants/hono';
import { getAuthToken } from '@/libs/auth';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const adminSession = await AdminSessionModel.findByRouteIdOrThrowNotFoundError(ctx, { a: ctx.adminId });
    if (adminSession.token === getAuthToken(ctx)) throwApiError(400);
    await adminSession.deleteOne();
    return ctx.createApiSuccessResponse();
});
