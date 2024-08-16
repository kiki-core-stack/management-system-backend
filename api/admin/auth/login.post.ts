import { AdminLogType } from '@kikiutils/el-plus-admin-pack/constants/admin';
import { AdminLogModel, AdminModel } from '@kikiutils/el-plus-admin-pack/models';

import { adminLoginDataValidator } from '@/validators/admin/auth/login';

export default defineEventHandler(async (event) => {
	const data = await adminLoginDataValidator(event);
	if (data.verCode !== popH3EventContextSession(event, 'verCode')?.toLowerCase()) createH3ErrorAndThrow(400, '驗證碼錯誤！', { isVerCodeIncorrect: true });
	const admin = await AdminModel.findByAccount(data.account);
	if (!admin) createH3ErrorAndThrow(404, '帳號不存在，未啟用或密碼錯誤！');
	event.context.session.tempAdminIdForSendEmailOtpCode = admin.id;
	await requireTwoFactorAuthentication(event, true, true, admin, true);
	if (!admin.verifyPassword(data.password)) createH3ErrorAndThrow(404, '帳號不存在，未啟用或密碼錯誤！');
	await cleanupAdminCachesAndEventSession(event, admin);
	event.context.session.adminId = admin.id;
	AdminLogModel.create({
		admin,
		ip: getRequestIP(event, { xForwardedFor: true }),
		type: AdminLogType.LoginSuccess
	});

	return createResponseData();
});
