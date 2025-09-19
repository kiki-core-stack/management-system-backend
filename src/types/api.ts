import type { AnyRecord } from '@kikiutils/shared/types';

declare global {
    interface ParsedApiRequestQueryParams {
        endIndex: number;
        fields: string[];
        filter: AnyRecord;
        limit: number;
        page: number;
        projection: Record<string, boolean>;
        skip: number;
        sort: Record<string, -1 | 1>;
    }
}

export {};
