import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models/admin';
import type { AdminData } from '@kikiutils/kiki-core-stack-pack/types/data/admin';

export const jsonSchema = z.object({
	account: z.string().trim().max(16).min(1),
	email: z.string().trim().email().toLowerCase().optional(),
	enabled: z.boolean(),
	name: z.string().trim().max(16).min(1),
	password: z.string().trim().length(128).optional(),
	twoFactorAuthenticationStatus: z.object({ emailOTP: z.boolean(), totp: z.boolean() })
}) satisfies ZodValidatorType<AdminData>;

export default defaultHonoFactory.createHandlers(apiZValidator('json', jsonSchema), async (ctx) => {
	const data = ctx.req.valid('json');
	if (data.password!.length !== 128) throwAPIError(400);
	await AdminModel.create(data);
	return ctx.createAPISuccessResponse();
});
