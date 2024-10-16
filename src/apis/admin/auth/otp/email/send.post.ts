import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineRouteHandler(async (request, response) => {
	const admin = request.locals.admin || (await AdminModel.findById(request.locals.session.tempAdminIdForSendEmailOtpCode));
	if (!admin) throwApiError(400);
	if (!(await sendEmailOtpCode(admin))) throwApiError(500, '發送失敗！');
});
