export default defaultHonoFactory.createHandlers(async (ctx) => {
    await requireEmailOtpTwoFactorAuthentication(ctx, ctx.admin!, 'adminToggleTwoFactorAuthenticationStatus', true);
    await requireTotpTwoFactorAuthentication(ctx, ctx.admin!);
    // eslint-disable-next-line style/max-len
    await ctx.admin!.updateOne({ 'twoFactorAuthenticationStatus.emailOtp': !ctx.admin!.twoFactorAuthenticationStatus.emailOtp });
    return ctx.createApiSuccessResponse();
});
