export type {} from '@kiki-core-stack/pack/types';

declare global {
    interface ProcessedApiRequestQueries {
        fields: string[];
        filter: Dict<any>;
        limit: number;
        offset: number;
        page: number;
        skip: number;
    }
}
