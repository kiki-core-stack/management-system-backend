export type {} from '@kiki-core-stack/pack/types';

declare global {
    interface ProcessedApiRequestQueries {
        fields: string[];
        filter: Record<string, any>;
        limit: number;
        offset: number;
        page: number;
        skip: number;
    }
}
