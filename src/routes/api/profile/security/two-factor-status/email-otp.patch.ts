export default defaultHonoFactory.createHandlers(async (ctx) => {
    await requireEmailOTPTwoFactorAuthentication(ctx, ctx.admin!, 'adminToggleTwoFactorAuthenticationStatus', true);
    await requireTOTPTwoFactorAuthentication(ctx, ctx.admin!);
    await ctx.admin!.updateOne({ 'twoFactorAuthenticationStatus.emailOTP': !ctx.admin!.twoFactorAuthenticationStatus.emailOTP });
    return ctx.createAPISuccessResponse();
});
