import type { Context } from 'hono';

import { honoApp } from '@/core/app';

declare module 'hono' {
    interface Context {
        createApiSuccessResponse: {
            <D extends object>(data?: D, message?: string): Response;
            <D extends object>(message?: string, data?: D): Response;
        };
    }
}

function createApiSuccessResponse(this: Context, arg1: any, arg2: any) {
    return this.json(createApiSuccessResponseData(arg1, arg2));
}

honoApp.use('/api/*', (ctx, next) => {
    ctx.createApiSuccessResponse = createApiSuccessResponse.bind(ctx);
    return next();
});
