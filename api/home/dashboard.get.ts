export default defineEventHandler(async (event) => {
	const processedQueries = getModelToPaginatedResponseDataProcessedQueries(event);
	console.log(processedQueries);
	return createResponseData({});
});
