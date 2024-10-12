import { AdminLogModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineApiRouteHandler(async (ctx) => {
	return await modelToPaginatedResponseData(ctx, AdminLogModel, {
		populate: { path: 'admin', select: ['-_id', 'account'] },
		options: { readPreference: 'secondaryPreferred' }
	});
});
