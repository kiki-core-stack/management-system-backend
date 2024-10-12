import { requireTwoFactorAuthentication } from '@kikiutils/kiki-core-stack-pack/hono-backend/utils/two-factor-authentication';
import type { ProfileSecurityChangePasswordFormData } from '@kikiutils/kiki-core-stack-pack/types/data/profile';

export const validator = zValidator(
	'json',
	z.object({
		conformPassword: z.string().trim().length(128),
		oldPassword: z.string().trim().length(128),
		newPassword: z.string().trim().length(128)
	})
);

export default defineApiRouteHandler<{ out: { json: ProfileSecurityChangePasswordFormData } }>(async (ctx) => {
	const data = ctx.req.valid('json');
	if (data.newPassword !== data.conformPassword) throwApiError(400, '確認密碼不符！');
	await requireTwoFactorAuthentication(ctx);
	if (!ctx.admin!.verifyPassword(data.oldPassword)) throwApiError(400, '舊密碼錯誤！');
	if (data.newPassword === data.oldPassword) throwApiError(400, '新密碼不能與舊密碼相同！');
	await ctx.admin!.updateOne({ password: data.newPassword });
	await cleanupAdminCachesAndEventSession(ctx, ctx.admin!);
});
