import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineRouteHandler(async (request, response) => {
	const admin = request.locals.admin || (await AdminModel.findById(request.locals.session.tempAdminIdForSendEmailOTPCode));
	if (!admin) throwAPIError(400);
	if (!(await sendEmailOTPCode(admin))) throwAPIError(500, '發送失敗！');
	sendAPISuccessResponse(response);
});
