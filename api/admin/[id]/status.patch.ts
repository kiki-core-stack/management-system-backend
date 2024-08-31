import { AdminModel } from '@kikiutils/el-plus-admin-pack/models';

export default defineEventHandler(async (event) => {
	return await getModelDocumentByRouteIdAndChangeStatus(
		event,
		AdminModel,
		[
			'enabled',
			'twoFactorAuthenticationStatus.emailOtp',
			'twoFactorAuthenticationStatus.totp'
		],
		null,
		(admin, field) => {
			if (field === 'enabled' && admin.id === event.context.session.adminId) createApiErrorAndThrow(400, '無法開關自己的啟用狀態！');
		}
	);
});
