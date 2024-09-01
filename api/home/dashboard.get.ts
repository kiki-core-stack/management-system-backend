export default defineEventHandler(async (event) => {
	// @ts-expect-error
	const processedQueries = getModelToPaginatedResponseDataProcessedQueries(event);
	return createApiSuccessResponseData({});
});
