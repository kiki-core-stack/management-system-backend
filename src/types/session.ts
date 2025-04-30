declare module '@/libs/middlewares/session/types' {
    interface ContextSessionData {
        /**
         * Validation codes generated in `/api/ver-code` are stored here.
         */
        verCode?: string;
    }
}

export {};
