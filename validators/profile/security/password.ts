import type { ProfileSecurityChangePasswordFormData } from '@kikiutils/el-plus-admin-pack/types/data/profile';

const schema: AjvValidatorJSONSchema<ProfileSecurityChangePasswordFormData> = {
	additionalProperties: false,
	properties: {
		conformPassword: commonAjvValidatorSchemas.string.trimmed.required,
		oldPassword: commonAjvValidatorSchemas.string.trimmed.required,
		newPassword: commonAjvValidatorSchemas.string.trimmed.required
	},
	required: [
		'conformPassword',
		'oldPassword',
		'newPassword'
	],
	type: 'object'
};

export const changePasswordDataValidator = compileH3RequestDataValidator(schema);
