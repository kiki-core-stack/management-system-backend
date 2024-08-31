import { AdminModel } from '@kikiutils/el-plus-admin-pack/models';

export default defineEventHandler(async (event) => {
	const admin = event.context.admin || (await AdminModel.findById(event.context.session.tempAdminIdForSendEmailOtpCode));
	if (!admin) createApiErrorAndThrow(400);
	if (await sendEmailOtpCode(admin!)) return createApiSuccessResponseData();
	createApiErrorAndThrow(500, '發送失敗！');
});
