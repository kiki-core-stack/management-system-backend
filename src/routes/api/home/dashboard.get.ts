import { defaultHonoFactory } from '@/core/constants/hono';
import { parseApiRequestQueryParams } from '@/libs/request';

export default defaultHonoFactory.createHandlers((ctx) => {
    const parsedApiRequestQueryParams = parseApiRequestQueryParams(ctx);
    return ctx.createApiSuccessResponse(parsedApiRequestQueryParams);
});
