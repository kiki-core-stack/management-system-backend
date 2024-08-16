export interface AdminLoginFormData extends TwoFactorAuthenticationCodesData {
	account: string;
	password: string;
	verCode: string;
}
