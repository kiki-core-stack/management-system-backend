import type { ProfileSecurityChangePasswordFormData } from '@kikiutils/kiki-core-stack-pack/types/data/profile';

export default defaultHonoFactory.createHandlers(
    apiZValidator(
        'json',
        z.object({
            conformPassword: z.string().trim().length(128),
            newPassword: z.string().trim().length(128),
            oldPassword: z.string().trim().length(128),
        }) satisfies ZodValidatorType<ProfileSecurityChangePasswordFormData>,
    ),
    async (ctx) => {
        const data = ctx.req.valid('json');
        if (data.newPassword !== data.conformPassword) throwAPIError(400, '確認密碼不符！');
        await requireTwoFactorAuthentication(ctx);
        if (!ctx.admin!.verifyPassword(data.oldPassword)) throwAPIError(400, '舊密碼不正確！');
        if (data.newPassword === data.oldPassword) throwAPIError(400, '新密碼不能與舊密碼相同！');
        await ctx.admin!.updateOne({ password: data.newPassword });
        await cleanupAdminCachesAndSession(ctx, ctx.admin!);
        return ctx.createAPISuccessResponse();
    },
);
