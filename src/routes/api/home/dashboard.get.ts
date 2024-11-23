export default defaultHonoFactory.createHandlers((ctx) => {
    const processedQueries = getProcessedAPIRequestQueries(ctx);
    return ctx.createAPISuccessResponse(processedQueries);
});
