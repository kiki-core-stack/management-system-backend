declare global {
    interface ParsedApiRequestQueryParams {
        endIndex: number;
        fields: string[];
        filters: AnyRecord;
        limit: number;
        page: number;
        skip: number;
    }
}

export {};
