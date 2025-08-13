import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { getAuthToken } from '@/libs/auth';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'ignore' } });

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const adminSession = await AdminSessionModel.findByRouteIdOrThrowNotFoundError(ctx, { admin: ctx.adminId });
    if (adminSession.token === getAuthToken(ctx)) throwApiError(400);
    await adminSession.deleteOne();
    return ctx.createApiSuccessResponse();
});
