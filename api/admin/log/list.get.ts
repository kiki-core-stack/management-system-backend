import { AdminLogModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineEventHandler(async (event) => {
	return await modelToPaginatedResponseData(event, AdminLogModel, {
		populate: { path: 'admin', select: ['-_id', 'account'] },
		options: { readPreference: 'secondaryPreferred' }
	});
});
