import type { Context } from 'hono';
import type { HydratedDocument, ProjectionType, QueryOptions, RootFilterQuery } from 'mongoose';

declare module '@kikiutils/mongoose/types' {
	interface BaseModelStatics<RawDocType, InstanceMethodsAndOverrides = {}, QueryHelpers = {}> {
		findByRouteId(
			ctx: Context,
			projection?: Nullable<ProjectionType<RawDocType>>,
			options?: Nullable<QueryOptions<RawDocType>>
		): MongooseFindOneReturnType<RawDocType, HydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>, QueryHelpers, InstanceMethodsAndOverrides>;

		findByRouteIdOrThrowNotFoundError(
			ctx: Context,
			filterQuery?: RootFilterQuery<RawDocType>,
			projection?: Nullable<ProjectionType<RawDocType>>,
			options?: Nullable<QueryOptions<RawDocType>>
		): Promise<HydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>>;
	}
}
