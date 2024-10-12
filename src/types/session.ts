declare module '../middlewares/session' {
	interface HonoContextSession {
		adminId: string;
		tempAdminIdForSendEmailOtpCode: string;

		/**
		 * Validation codes generated in `/api/ver-code` are stored here.
		 */
		verCode?: string;
	}
}

export {};
