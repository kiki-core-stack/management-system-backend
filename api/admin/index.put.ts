import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

import { saveAdminDataValidator } from '@/validators/admin';

export default defineEventHandler(async (event) => {
	const data = await saveAdminDataValidator(event);
	if (data.password?.length !== 128) createApiErrorAndThrow(400);
	await AdminModel.create(data);
	return createApiSuccessResponseData();
});
