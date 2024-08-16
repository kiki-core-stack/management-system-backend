declare module '@kikiutils/nitro-session' {
	interface H3EventContextSession {
		adminId: string;
		tempAdminIdForSendEmailOtpCode: string;

		/**
		 * Validation codes generated in `/api/ver-code` are stored here.
		 */
		verCode?: string;
	}
}

export {};
