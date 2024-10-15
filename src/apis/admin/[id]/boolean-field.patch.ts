import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineRouteHandler(async (request, response) => {
	await getModelDocumentByRouteIdAndUpdateBooleanField(
		request,
		response,
		AdminModel,
		[
			'enabled',
			'twoFactorAuthenticationStatus.emailOtp',
			'twoFactorAuthenticationStatus.totp'
		],
		null,
		(admin, field) => {
			if (field === 'enabled' && admin.id === request.locals.session.adminId) throwApiError(400, '無法變更自己的啟用狀態！');
		}
	);
});
