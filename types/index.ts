export type {} from '@kikiutils/el-plus-admin-pack/types';
export type {} from '@kikiutils/el-plus-admin-pack/types/data';
export type {} from '@kikiutils/el-plus-admin-pack/types/mongoose';

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
