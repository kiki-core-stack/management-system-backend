import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers((ctx) => {
    if (ctx.adminId) return ctx.createApiSuccessResponse({ id: ctx.adminId });
    return ctx.createApiSuccessResponse();
});
