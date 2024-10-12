import { mongooseConnections } from '@kikiutils/kiki-core-stack-pack/constants/mongoose';
import { AdminLogModel, AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineApiRouteHandler(async (ctx) => {
	return await mongooseConnections.default!.transaction(async (session) => {
		return await getModelDocumentByRouteIdAndDelete(ctx, AdminModel, { session }, async (admin) => {
			if (admin.id === ctx.session.adminId) throwApiError(409, '無法刪除自己！');
			if ((await AdminModel.countDocuments()) === 1) throwApiError(409, '無法刪除最後一位管理員！');
			await AdminLogModel.deleteMany({ admin }, { session });
		});
	});
});
