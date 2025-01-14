import { sendEmailOTPCode } from '@kiki-core-stack/pack/hono-backend/libs/otp';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { EmailOTPCodeType } from '@kiki-core-stack/pack/types/otp';

const jsonSchema = z.object({
    type: z.enum([
        'adminChangePassword',
        'adminLogin',
        'adminToggleTwoFactorAuthenticationStatus',
    ]),
}) satisfies ZodValidatorType<{ type: EmailOTPCodeType }>;

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const { type } = ctx.req.valid('json');
        let admin = ctx.admin;
        if (type === 'adminLogin') {
            admin = await AdminModel.findById(ctx.session.tempAdminIdForSendEmailOTPCode);
            if (!admin) throwAPIError(400);
        } else if (!admin) throwAPIError(401);
        if (!admin.email) throwAPIError(400, 'Email未綁定，無法發送OTP驗證碼！');
        await sendEmailOTPCode(type, admin.email, admin.id);
        return ctx.createAPISuccessResponse();
    },
);
