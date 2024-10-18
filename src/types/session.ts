declare module '../core/middlewares/session/types' {
	interface RequestLocalsSession {
		adminId: string;
		tempAdminIdForSendEmailOTPCode: string;

		/**
		 * Validation codes generated in `/api/ver-code` are stored here.
		 */
		verCode?: string;
	}
}

export {};
