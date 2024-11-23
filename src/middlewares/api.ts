import type { Context } from 'hono';

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

export default defaultHonoFactory.createMiddleware((ctx, next) => {
    ctx.createAPISuccessResponse = createAPISuccessResponse.bind(ctx);
    return next();
});
