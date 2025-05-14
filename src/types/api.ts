declare global {
    interface ParsedApiRequestQueryParams {
        endIndex: number;
        fields: string[];
        filter: AnyRecord;
        limit: number;
        page: number;
        projection: Record<string, boolean>;
        skip: number;
    }
}

export {};
