export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defineRouteHandler(async (request, response) => {
	await cleanupAdminCachesAndSession(request, request.locals.admin!);
	sendApiSuccessResponse(response);
});
