import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import { sendEmailOtpCode } from '@kikiutils/kiki-core-stack-pack/nitro/utils/two-factor-authentication';

export default defineEventHandler(async (event) => {
	const admin = event.context.admin || (await AdminModel.findById(event.context.session.tempAdminIdForSendEmailOtpCode));
	if (!admin) createApiErrorAndThrow(400);
	if (await sendEmailOtpCode(admin!)) return createApiSuccessResponseData();
	createApiErrorAndThrow(500, '發送失敗！');
});
