export type {} from '@kikiutils/kiki-core-stack-pack/types';

declare global {
    interface ProcessedAPIRequestQueries {
        filterQuery: Dict<any>;
        limit: number;
        offset: number;
        page: number;
        selectFields: string[];
        skip: number;
    }
}
