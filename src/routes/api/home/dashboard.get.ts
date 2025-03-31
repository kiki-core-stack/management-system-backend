import { defaultHonoFactory } from '@/core/constants/hono';
import { getProcessedApiRequestQueries } from '@/libs/request';

export default defaultHonoFactory.createHandlers((ctx) => {
    const processedQueries = getProcessedApiRequestQueries(ctx);
    return ctx.createApiSuccessResponse(processedQueries);
});
