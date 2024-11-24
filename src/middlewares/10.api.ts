import type { Context } from 'hono';

import { honoApp } from '@/core/app';

declare module 'hono' {
    interface Context {
        createAPISuccessResponse: {
            <D extends object>(data?: D, message?: string): Response;
            <D extends object>(message?: string, data?: D): Response;
        };
    }
}

function createAPISuccessResponse(this: Context, arg1: any, arg2: any) {
    return this.json(createAPISuccessResponseData(arg1, arg2));
}

honoApp.use('/api/*', (ctx, next) => {
    ctx.createAPISuccessResponse = createAPISuccessResponse.bind(ctx);
    return next();
});
