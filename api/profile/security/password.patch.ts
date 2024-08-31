import { changePasswordDataValidator } from '@/validators/profile/security/password';

export default defineEventHandler(async (event) => {
	const data = await changePasswordDataValidator(event);
	if (data.newPassword !== data.conformPassword) createApiErrorAndThrow(400, '確認密碼不符！');
	await requireTwoFactorAuthentication(event);
	if (!event.context.admin!.verifyPassword(data.oldPassword)) createApiErrorAndThrow(400, '舊密碼錯誤！');
	if (data.newPassword === data.oldPassword) createApiErrorAndThrow(400, '新密碼不能與舊密碼相同！');
	await event.context.admin!.updateOne({ password: data.newPassword });
	await cleanupAdminCachesAndEventSession(event, event.context.admin!);
	return createApiSuccessResponseData();
});
