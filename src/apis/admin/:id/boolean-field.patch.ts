import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineApiRouteHandler(async (ctx) => {
	return await getModelDocumentByRouteIdAndUpdateBooleanField(
		ctx,
		AdminModel,
		[
			'enabled',
			'twoFactorAuthenticationStatus.emailOtp',
			'twoFactorAuthenticationStatus.totp'
		],
		null,
		(admin, field) => {
			if (field === 'enabled' && admin.id === ctx.session.adminId) throwApiError(400, '無法變更自己的啟用狀態！');
		}
	);
});
