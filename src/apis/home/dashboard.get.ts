export default defaultHonoFactory.createHandlers((ctx) => {
	const processedQueries = getProcessedAPIRequestQueries(ctx);
	return ctx.json(createAPISuccessResponseData(processedQueries));
});
