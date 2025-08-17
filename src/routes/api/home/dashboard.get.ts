import { defaultHonoFactory } from '@/core/constants/hono';
import { parseApiRequestQueryParams } from '@/libs/request';

export const routePermission = 'home.dashboard.view';

export default defaultHonoFactory.createHandlers((ctx) => {
    const parsedApiRequestQueryParams = parseApiRequestQueryParams(ctx);
    return ctx.createApiSuccessResponse(parsedApiRequestQueryParams);
});
