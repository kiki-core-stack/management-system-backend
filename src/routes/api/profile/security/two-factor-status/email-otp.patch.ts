export default defaultHonoFactory.createHandlers(async (ctx) => {
    const admin = ctx.admin!.$clone();
    const isEnabled = admin.twoFactorAuthenticationStatus.emailOTP;
    admin.twoFactorAuthenticationStatus.emailOTP = true;
    await requireTwoFactorAuthentication(ctx, true, true, admin);
    await admin.updateOne({ 'twoFactorAuthenticationStatus.emailOTP': !isEnabled });
    return ctx.createAPISuccessResponse();
});
