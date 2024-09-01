import type { AdminData } from '@kikiutils/kiki-core-stack-pack/types/data/admin';

const schema: AjvValidatorJSONSchema<AdminData, 'totpSecret'> = {
	additionalProperties: false,
	properties: {
		account: commonAjvValidatorSchemas.string.short.trimmed.required,
		email: commonAjvValidatorSchemas.email.nonRequired,
		enabled: commonAjvValidatorSchemas.boolean.required,
		name: commonAjvValidatorSchemas.string.short.trimmed.required,
		password: {
			...commonAjvValidatorSchemas.string.trimmed.nonRequired,
			maxLength: 128,
			minLength: 128
		},
		twoFactorAuthenticationStatus: {
			additionalProperties: false,
			properties: {
				emailOtp: commonAjvValidatorSchemas.boolean.required,
				totp: commonAjvValidatorSchemas.boolean.required
			},
			required: ['emailOtp', 'totp'],
			type: 'object'
		}
	},
	required: [
		'account',
		'enabled',
		'name',
		'twoFactorAuthenticationStatus'
	],
	type: 'object'
};

export const saveAdminDataValidator = compileH3RequestDataValidator(schema);
