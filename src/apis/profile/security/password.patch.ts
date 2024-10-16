import type { ProfileSecurityChangePasswordFormData } from '@kikiutils/kiki-core-stack-pack/types/data/profile';

export default defineRouteHandlerWithZodValidator(
	{
		json: z.object({
			conformPassword: z.string().trim().length(128),
			oldPassword: z.string().trim().length(128),
			newPassword: z.string().trim().length(128)
		}) satisfies ZodValidatorType<ProfileSecurityChangePasswordFormData>
	},
	async (request, response) => {
		const data = request.locals.verifiedData.json;
		if (data.newPassword !== data.conformPassword) throwApiError(400, '確認密碼不符！');
		await requireTwoFactorAuthentication(request);
		if (!request.locals.admin!.verifyPassword(data.oldPassword)) throwApiError(400, '舊密碼錯誤！');
		if (data.newPassword === data.oldPassword) throwApiError(400, '新密碼不能與舊密碼相同！');
		await request.locals.admin!.updateOne({ password: data.newPassword });
		await cleanupAdminCachesAndSession(request, request.locals.admin!);
		sendApiSuccessResponse(response);
	}
);
