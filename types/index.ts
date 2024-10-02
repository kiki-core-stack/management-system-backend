export type {} from '@kikiutils/kiki-core-stack-pack/nitro/types/mongoose';
export type {} from '@kikiutils/kiki-core-stack-pack/types';
export type {} from '@kikiutils/kiki-core-stack-pack/types/data';
export type {} from '@kikiutils/mongoose/types';

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
