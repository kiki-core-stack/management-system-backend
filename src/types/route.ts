declare module '@/core/types/route' {
    interface RouteHandlerProperties {
        noLoginRequired?: boolean;
        permission: 'ignore' | (string & {});
    }
}

export {};
