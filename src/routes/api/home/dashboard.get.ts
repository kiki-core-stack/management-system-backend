import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { parseApiRequestQueryParams } from '@/libs/request';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'home.dashboard.view' } });

export default defaultHonoFactory.createHandlers((ctx) => {
    const parsedApiRequestQueryParams = parseApiRequestQueryParams(ctx);
    return ctx.createApiSuccessResponse(parsedApiRequestQueryParams);
});
