export type {} from '@kiki-core-stack/pack/types';

declare global {
    interface ParsedApiRequestQueryParams {
        fields: string[];
        filters: AnyRecord;
        limit: number;
        page: number;
    }
}
