import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';
import type { UpdateQuery } from 'mongoose';

import { jsonSchema } from '../index.put';

export default defineRouteHandlerWithZodValidator({ json: jsonSchema }, async (request) => {
	const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(request);
	const updateQuery: UpdateQuery<AdminDocument> = request.locals.verifiedData.json;
	updateQuery.enabled = updateQuery.enabled || admin.id === request.locals.session.adminId;
	if (!updateQuery.email) updateQuery.$unset = { email: true };
	await admin.updateOne(updateQuery);
});
