import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defaultHonoFactory.createHandlers(async (ctx) => {
	const admin = ctx.admin || (await AdminModel.findById(ctx.session.tempAdminIdForSendEmailOTPCode));
	if (!admin) throwAPIError(400);
	if (!(await sendEmailOTPCode(admin))) throwAPIError(500, '發送失敗！');
	return ctx.json(createAPISuccessResponseData());
});
