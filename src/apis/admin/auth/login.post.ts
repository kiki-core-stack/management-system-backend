import { AdminLogType } from '@kikiutils/kiki-core-stack-pack/constants/admin';
import { AdminLogModel, AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import type { AdminLoginFormData } from '@kikiutils/kiki-core-stack-pack/types/data/admin';

export const handlerProperties = Object.freeze({ noLoginRequired: true });
export const zodOpenApiRouteConfig = createApiZodOpenApiRouteConfig('adminLogin', '', ['admin'], {
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						account: z.string().trim().min(1),
						password: z.string().trim(),
						verCode: z.string().trim().toLowerCase()
					})
				}
			}
		}
	}
});

export default defineApiRouteHandler<{ out: { json: AdminLoginFormData } }>(async (ctx) => {
	const data = ctx.req.valid('json');
	if (data.verCode !== popHonoContextSession(ctx, 'verCode')?.toLowerCase()) throwApiError(400, '驗證碼錯誤！', { isVerCodeIncorrect: true });
	const admin = await AdminModel.findOne({ account: data.account, enabled: true });
	if (!admin) throwApiError(404, '帳號不存在，未啟用或密碼錯誤！');
	ctx.session.tempAdminIdForSendEmailOtpCode = admin.id;
	// await requireTwoFactorAuthentication(event, true, true, admin, true);
	if (!admin.verifyPassword(data.password)) throwApiError(404, '帳號不存在，未啟用或密碼錯誤！');
	cleanupAdminCachesAndEventSession(ctx, admin);
	ctx.session.adminId = admin.id;
	AdminLogModel.create({
		admin,
		ip: getXForwardedForHeaderFirstValue(ctx),
		type: AdminLogType.LoginSuccess
	});
});
