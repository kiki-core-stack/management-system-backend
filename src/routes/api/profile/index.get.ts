import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { getAdminPermission } from '@/libs/admin/permission';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    if (!ctx.adminId) return ctx.createApiSuccessResponse();
    return ctx.createApiSuccessResponse({
        id: ctx.adminId,
        permission: await getAdminPermission(ctx.adminId),
    });
});
