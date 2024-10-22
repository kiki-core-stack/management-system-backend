import { AdminLogType } from '@kikiutils/kiki-core-stack-pack/constants/admin';
import { AdminLogModel, AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import type { AdminLoginFormData } from '@kikiutils/kiki-core-stack-pack/types/data/admin';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers(
	apiZValidator(
		'json',
		z.object({
			account: z.string().trim().min(1),
			password: z.string().trim().min(1),
			verCode: z.string().trim().min(1).toLowerCase()
		}) satisfies ZodValidatorType<AdminLoginFormData>
	),
	async (ctx) => {
		const data = ctx.req.valid('json');
		if (data.verCode !== ctx.popSession('verCode')?.toLowerCase()) throwAPIError(400, '驗證碼不正確！', { isVerCodeIncorrect: true });
		const admin = await AdminModel.findOne({ account: data.account, enabled: true });
		if (!admin) throwAPIError(404, '帳號不存在，未啟用或密碼不正確！');
		ctx.session.tempAdminIdForSendEmailOTPCode = admin.id;
		await requireTwoFactorAuthentication(ctx, true, true, admin, true);
		if (!admin.verifyPassword(data.password)) throwAPIError(404, '帳號不存在，未啟用或密碼不正確！');
		await cleanupAdminCachesAndSession(ctx, admin);
		ctx.session.adminId = admin.id;
		AdminLogModel.create({
			admin,
			ip: getXForwardedForHeaderFirstValue(ctx),
			type: AdminLogType.LoginSuccess
		});

		return ctx.json(createAPISuccessResponseData());
	}
);
