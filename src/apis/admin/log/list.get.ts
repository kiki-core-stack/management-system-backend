import { AdminLogModel } from '@kikiutils/kiki-core-stack-pack/models/admin/log';

export default defaultHonoFactory.createHandlers(async (ctx) => {
	return ctx.createAPISuccessResponse(
		await modelToPaginatedData(ctx, AdminLogModel, {
			populate: { path: 'admin', select: ['-_id', 'account'] },
			options: { readPreference: 'secondaryPreferred' }
		})
	);
});
