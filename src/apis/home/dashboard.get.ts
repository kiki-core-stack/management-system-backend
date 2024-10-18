export default defineRouteHandler((request, response) => {
	const processedQueries = getProcessedAPIRequestQueries(request);
	sendAPISuccessResponse(response, processedQueries);
});
