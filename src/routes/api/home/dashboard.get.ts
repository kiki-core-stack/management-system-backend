export default defaultHonoFactory.createHandlers((ctx) => {
    const processedQueries = getProcessedApiRequestQueries(ctx);
    return ctx.createApiSuccessResponse(processedQueries);
});
