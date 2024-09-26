import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineEventHandler(async (event) => {
	return await getModelDocumentByRouteIdAndUpdateBooleanField(
		event,
		AdminModel,
		[
			'enabled',
			'twoFactorAuthenticationStatus.emailOtp',
			'twoFactorAuthenticationStatus.totp'
		],
		null,
		(admin, field) => {
			if (field === 'enabled' && admin.id === event.context.session.adminId) createApiErrorAndThrow(400, '無法變更自己的啟用狀態！');
		}
	);
});
