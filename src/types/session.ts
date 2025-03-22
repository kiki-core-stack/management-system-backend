declare module '../core/middlewares/session/types' {
    interface ContextSessionData {
        /**
         * Validation codes generated in `/api/ver-code` are stored here.
         */
        verCode?: string;
    }
}

export {};
