export default defineEventHandler(async (event) => {
	await cleanupAdminCachesAndEventSession(event, event.context.admin!);
	return createApiSuccessResponseData();
});
