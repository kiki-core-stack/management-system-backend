export type {} from '@kikiutils/kiki-core-stack-pack/types';

declare global {
	interface ProcessedApiRequestQueries {
		filterQuery: Dict<any>;
		limit: number;
		offset: number;
		page: number;
		selectFields: string[];
		skip: number;
	}
}
