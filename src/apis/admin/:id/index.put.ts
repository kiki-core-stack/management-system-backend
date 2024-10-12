import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';
import type { AdminData } from '@kikiutils/kiki-core-stack-pack/types/data/admin';
import type { UpdateQuery } from 'mongoose';

export { validator } from '../index.put';

export default defineApiRouteHandler<{ out: { json: AdminData } }>(async (ctx) => {
	const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx);
	const updateQuery: UpdateQuery<AdminDocument> = ctx.req.valid('json');
	updateQuery.enabled = updateQuery.enabled || admin.id === ctx.session.adminId;
	if (!updateQuery.email) updateQuery.$unset = { email: true };
	await admin.updateOne(updateQuery);
});
