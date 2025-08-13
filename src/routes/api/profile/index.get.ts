import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';

export const routeHandlerOptions = defineRouteHandlerOptions({
    properties: {
        noLoginRequired: true,
        permission: 'ignore',
    },
});

export default defaultHonoFactory.createHandlers((ctx) => {
    if (!ctx.adminId) return ctx.createApiSuccessResponse();
    return ctx.createApiSuccessResponse({ id: ctx.adminId });
});
