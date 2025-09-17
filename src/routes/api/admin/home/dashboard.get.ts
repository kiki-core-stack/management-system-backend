import { defaultHonoFactory } from '@/core/constants/hono';
import { parseApiRequestQueryParams } from '@/libs/request';

export const routePermission = {
    key: 'home.dashboard.view',
    type: 'admin',
};

export default defaultHonoFactory.createHandlers((ctx) => {
    const parsedApiRequestQueryParams = parseApiRequestQueryParams(ctx);
    return ctx.createApiSuccessResponse(parsedApiRequestQueryParams);
});
