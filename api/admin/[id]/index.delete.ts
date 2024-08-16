import { AdminLogModel, AdminModel, mongooseConnections } from '@kikiutils/el-plus-admin-pack/models';

export default defineEventHandler(async (event) => {
	try {
		return await mongooseConnections.default!.transaction(async (session) => {
			return await getModelDocumentByRouteIdAndDelete(event, AdminModel, { session }, async (admin) => {
				if (admin.id === event.context.session.adminId) createH3ErrorAndThrow(409, '無法刪除自己！');
				if ((await AdminModel.countDocuments()) === 1) createH3ErrorAndThrow(409, '無法刪除最後一位管理員！');
				await AdminLogModel.deleteMany({ admin }, { session });
			});
		});
	} catch (error) {
		if (isError(error)) throw error;
		createH3ErrorAndThrow();
	}
});
