import { sendEmailOtpCode } from '@kiki-core-stack/pack/hono-backend/libs/otp';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { EmailOtpCodeType } from '@kiki-core-stack/pack/types/otp';

const jsonSchema = z.object({
    email: z.string().trim().email().optional(),
    type: z.enum([
        'adminBindEmail',
        'adminChangePassword',
        'adminLogin',
        'adminToggleTwoFactorAuthenticationStatus',
    ]),
}) satisfies ZodValidatorType<{ type: EmailOtpCodeType }>;

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        let admin, email;
        switch (data.type) {
            case 'adminBindEmail':
                email = data.email;
                break;
            case 'adminLogin':
                admin = await AdminModel.findById(ctx.session.tempAdminIdForSendEmailOtpCode);
                if (!admin) throwApiError(500);
                break;
        }

        admin ??= ctx.admin;
        if (!admin) throwApiError(401);
        email ??= admin.email;
        if (!email) throwApiError(400, 'Email未綁定，無法發送OTP驗證碼！');
        await sendEmailOtpCode(data.type, email, admin.id);
        return ctx.createApiSuccessResponse();
    },
);
