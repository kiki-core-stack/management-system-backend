declare module '@/core/types/route' {
    interface RouteHandlerProperties {
        disableReplayProtection?: true;
        noLoginRequired?: true;
    }
}

export {};
