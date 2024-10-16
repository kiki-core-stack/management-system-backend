import { AdminLogType } from '@kikiutils/kiki-core-stack-pack/constants/admin';
import { AdminLogModel, AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import type { AdminLoginFormData } from '@kikiutils/kiki-core-stack-pack/types/data/admin';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defineRouteHandlerWithZodValidator(
	{
		json: z.object({
			account: z.string().trim().min(1),
			password: z.string().trim(),
			verCode: z.string().trim().toLowerCase()
		}) satisfies ZodValidatorType<AdminLoginFormData>
	},
	async (request, response) => {
		const data = request.locals.verifiedData.json;
		if (data.verCode !== (await request.session.pop('verCode'))?.toLowerCase()) throwApiError(400, '驗證碼錯誤！', { isVerCodeIncorrect: true });
		const admin = await AdminModel.findOne({ account: data.account, enabled: true });
		if (!admin) throwApiError(404, '帳號不存在，未啟用或密碼錯誤！');
		await request.session.set('tempAdminIdForSendEmailOtpCode', admin.id);
		await requireTwoFactorAuthentication(request, true, true, admin, true);
		if (!admin.verifyPassword(data.password)) throwApiError(404, '帳號不存在，未啟用或密碼錯誤！');
		await cleanupAdminCachesAndSession(request, admin);
		await request.session.set('adminId', admin.id);
		AdminLogModel.create({
			admin,
			ip: getXForwardedForHeaderFirstValue(request),
			type: AdminLogType.LoginSuccess
		});

		sendApiSuccessResponse(response);
	}
);
