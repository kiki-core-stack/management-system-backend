import { sendEmailOtpCode } from '@kikiutils/kiki-core-stack-pack/hono-backend/utils/two-factor-authentication';
import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineApiRouteHandler(async (ctx) => {
	const admin = ctx.admin || (await AdminModel.findById(ctx.session.tempAdminIdForSendEmailOtpCode));
	if (!admin) throwApiError(400);
	if (!(await sendEmailOtpCode(admin))) throwApiError(500, '發送失敗！');
});
