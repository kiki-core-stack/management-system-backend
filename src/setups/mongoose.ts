import { customMongooseOptions } from '@kikiutils/mongoose/options';
import type { Context } from 'hono';
import { Types } from 'mongoose';
import type { HydratedDocument, ProjectionType, QueryOptions, RootFilterQuery, Schema } from 'mongoose';

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

customMongooseOptions.beforeModelBuild = <DocType, Model extends BaseMongoosePaginateModel<DocType, InstanceMethodsAndOverrides, QueryHelpers>, InstanceMethodsAndOverrides = {}, QueryHelpers = {}>(
	schema: Schema<DocType, Model, InstanceMethodsAndOverrides, QueryHelpers>
) => {
	schema.static('findByRouteId', function (ctx: Context, projection?: Nullable<ProjectionType<DocType>>, options?: Nullable<QueryOptions<DocType>>) {
		return this.findById(ctx.req.param('id'), projection, options);
	});

	schema.static('findByRouteIdOrThrowNotFoundError', async function (ctx: Context, filterQuery?: RootFilterQuery<DocType>, projection?: Nullable<ProjectionType<DocType>>, options?: Nullable<QueryOptions<DocType>>) {
		const id = ctx.req.param('id');
		if (!id) throw new ApiError(404);
		if (!Types.ObjectId.isValid(id)) throw new ApiError(400);
		const document = await this.findOne({ ...filterQuery, _id: id }, projection, options);
		if (!document) throw new ApiError(404);
		return document;
	});
};
