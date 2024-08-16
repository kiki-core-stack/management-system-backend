import { AdminLogModel } from '@kikiutils/el-plus-admin-pack/models';

export default defineEventHandler(async (event) => {
	return await modelToPaginatedResponseData(event, AdminLogModel, {
		populate: { path: 'admin', select: ['-_id', 'account'] },
		options: { readPreference: 'secondaryPreferred' }
	});
});
