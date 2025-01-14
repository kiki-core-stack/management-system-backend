import {
    verifyEmailOTPCode,
    verifyTOTPCode,
} from '@kiki-core-stack/pack/libs/otp';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import type { EmailOTPCodeType } from '@kiki-core-stack/pack/types/otp';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { Context } from 'hono';

declare global {
    const requireEmailOTPTwoFactorAuthentication: (ctx: Context, admin: AdminDocument, type: EmailOTPCodeType, force?: true) => Promise<void>;
    const requireTOTPTwoFactorAuthentication: (ctx: Context, admin: AdminDocument, force?: true, secret?: string) => Promise<void>;
}

setReadonlyConstantToGlobalThis<typeof requireEmailOTPTwoFactorAuthentication>('requireEmailOTPTwoFactorAuthentication', async (ctx, admin, type, force) => {
    if (!admin.email || (!admin.twoFactorAuthenticationStatus.emailOTP && !force)) return;
    const { emailOTPCode } = await ctx.req.json<TwoFactorAuthenticationCodesData>();
    const requiredTwoFactorAuthentications = {
        ...admin.twoFactorAuthenticationStatus,
        emailOTP: true,
    };

    if (!emailOTPCode) throwAPIError(400, '請輸入Email OTP驗證碼！', { requiredTwoFactorAuthentications });
    if (!await verifyEmailOTPCode(emailOTPCode, type, admin.email, admin.id)) throwAPIError(400, 'Email OTP驗證碼錯誤！', { requiredTwoFactorAuthentications });
});

setReadonlyConstantToGlobalThis<typeof requireTOTPTwoFactorAuthentication>('requireTOTPTwoFactorAuthentication', async (ctx, admin, force, secret) => {
    const totpSecret = secret || admin.totpSecret;
    if (!totpSecret || (!admin.twoFactorAuthenticationStatus.totp && !force)) return;
    const { totpCode } = await ctx.req.json<TwoFactorAuthenticationCodesData>();
    const requiredTwoFactorAuthentications = {
        ...admin.twoFactorAuthenticationStatus,
        totp: true,
    };

    if (!totpCode) throwAPIError(400, '請輸入TOTP驗證碼！', { requiredTwoFactorAuthentications });
    if (!await verifyTOTPCode(totpCode, totpSecret)) throwAPIError(400, 'TOTP驗證碼錯誤！', { requiredTwoFactorAuthentications });
});
