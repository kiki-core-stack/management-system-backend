import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';
import type { UpdateQuery } from 'mongoose';

import { saveAdminDataValidator } from '@/validators/admin';

export default defineEventHandler(async (event) => {
	const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(event);
	const updateQuery: UpdateQuery<AdminDocument> = await saveAdminDataValidator(event);
	updateQuery.enabled = updateQuery.enabled || admin.id === event.context.session.adminId;
	if (!updateQuery.email) updateQuery.$unset = { email: true };
	await admin.updateOne(updateQuery);
	return createApiSuccessResponseData();
});
