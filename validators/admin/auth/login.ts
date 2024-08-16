import type { AdminLoginFormData } from '@/types/data/admin';

const schema: AjvValidatorJSONSchema<AdminLoginFormData> = {
	additionalProperties: false,
	properties: {
		account: commonAjvValidatorSchemas.string.short.trimmed.required,
		password: commonAjvValidatorSchemas.string.trimmed.required,
		verCode: {
			maxLength: 4,
			minLength: 4,
			transform: ['toLowerCase', 'trim'],
			type: 'string'
		}
	},
	required: [
		'account',
		'password',
		'verCode'
	],
	type: 'object'
};

export const adminLoginDataValidator = compileH3RequestDataValidator(schema);
