import { AdminLogModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineRouteHandler(async (request, response) => {
	await sendModelToPaginatedResponse(request, response, AdminLogModel, {
		populate: { path: 'admin', select: ['-_id', 'account'] },
		options: { readPreference: 'secondaryPreferred' }
	});
});
