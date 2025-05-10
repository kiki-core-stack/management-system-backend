declare global {
    interface ParsedApiRequestQueryParams {
        endIndex: number;
        fields: string[];
        filter: AnyRecord;
        limit: number;
        page: number;
        skip: number;
    }
}

export {};
