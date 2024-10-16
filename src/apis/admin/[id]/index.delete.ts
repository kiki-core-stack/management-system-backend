import { mongooseConnections } from '@kikiutils/kiki-core-stack-pack/constants/mongoose';
import { AdminLogModel, AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineRouteHandler(async (request, response) => {
	await mongooseConnections.default!.transaction(async (session) => {
		await getModelDocumentByRouteIdAndDelete(request, AdminModel, { session }, async (admin) => {
			if (admin.id === request.locals.session.adminId) throwApiError(409, '無法刪除自己！');
			if ((await AdminModel.countDocuments()) === 1) throwApiError(409, '無法刪除最後一位管理員！');
			await AdminLogModel.deleteMany({ admin }, { session });
		});
	});

	sendApiSuccessResponse(response);
});
