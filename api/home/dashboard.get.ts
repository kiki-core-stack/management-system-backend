export default defineEventHandler(async (event) => {
	const processedQueries = getModelToPaginatedResponseDataProcessedQueries(event);
	processedQueries;
	return createApiSuccessResponseData({});
});
