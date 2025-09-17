import { allAdminPermissions } from '@/constants/admin';
import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers((ctx) => {
    return ctx.createApiSuccessResponse([...allAdminPermissions].sort());
});
