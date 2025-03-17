import {
    verifyEmailOtpCode,
    verifyTotpCode,
} from '@kiki-core-stack/pack/libs/otp';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import type { EmailOtpCodeType } from '@kiki-core-stack/pack/types/otp';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { Context } from 'hono';

declare global {
    const requireEmailOtpTwoFactorAuthentication: (
        ctx: Context,
        admin: AdminDocument,
        type: EmailOtpCodeType,
        force?: true
    ) => Promise<void>;

    const requireTotpTwoFactorAuthentication: (
        ctx: Context,
        admin: AdminDocument,
        force?: true,
        secret?: string
    ) => Promise<void>;
}

setReadonlyConstantToGlobalThis<typeof requireEmailOtpTwoFactorAuthentication>(
    'requireEmailOtpTwoFactorAuthentication',
    async (ctx, admin, type, force) => {
        if (!admin.email || (!admin.twoFactorAuthenticationStatus.emailOtp && !force)) return;
        const { emailOtpCode } = await ctx.req.json<TwoFactorAuthenticationCodesData>();
        const requiredTwoFactorAuthentications = {
            ...admin.twoFactorAuthenticationStatus,
            emailOtp: true,
        };

        if (!emailOtpCode) throwApiError(400, '請輸入Email OTP驗證碼！', { requiredTwoFactorAuthentications });
        if (!await verifyEmailOtpCode(emailOtpCode, type, admin.email, admin.id)) {
            throwApiError(400, 'Email OTP驗證碼錯誤！', { requiredTwoFactorAuthentications });
        }
    },
);

setReadonlyConstantToGlobalThis<typeof requireTotpTwoFactorAuthentication>(
    'requireTotpTwoFactorAuthentication',
    async (ctx, admin, force, secret) => {
        const totpSecret = secret || admin.totpSecret;
        if (!totpSecret || (!admin.twoFactorAuthenticationStatus.totp && !force)) return;
        const { totpCode } = await ctx.req.json<TwoFactorAuthenticationCodesData>();
        const requiredTwoFactorAuthentications = {
            ...admin.twoFactorAuthenticationStatus,
            totp: true,
        };

        if (!totpCode) throwApiError(400, '請輸入TOTP驗證碼！', { requiredTwoFactorAuthentications });
        if (!await verifyTotpCode(totpCode, totpSecret)) {
            throwApiError(400, 'TOTP驗證碼錯誤！', { requiredTwoFactorAuthentications });
        }
    },
);
