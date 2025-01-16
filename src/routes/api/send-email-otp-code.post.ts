import { sendEmailOTPCode } from '@kiki-core-stack/pack/hono-backend/libs/otp';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { EmailOTPCodeType } from '@kiki-core-stack/pack/types/otp';

const jsonSchema = z.object({
    email: z.string().trim().email().optional(),
    type: z.enum([
        'adminBindEmail',
        'adminChangePassword',
        'adminLogin',
        'adminToggleTwoFactorAuthenticationStatus',
    ]),
}) satisfies ZodValidatorType<{ type: EmailOTPCodeType }>;

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
                admin = await AdminModel.findById(ctx.session.tempAdminIdForSendEmailOTPCode);
                if (!admin) throwAPIError(500);
                break;
        }

        admin ??= ctx.admin;
        if (!admin) throwAPIError(401);
        email ??= admin.email;
        if (!email) throwAPIError(400, 'Email未綁定，無法發送OTP驗證碼！');
        await sendEmailOTPCode(data.type, email, admin.id);
        return ctx.createAPISuccessResponse();
    },
);
