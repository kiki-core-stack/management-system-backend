export default defineRouteHandler((request, response) => {
	const processedQueries = getProcessedApiRequestQueries(request);
	sendApiSuccessResponse(response, processedQueries);
});
