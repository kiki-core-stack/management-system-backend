import { customMongooseOptions } from '@kikiutils/mongoose/options';
import type { Context } from 'hono';
import { Types } from 'mongoose';
import type { Schema } from 'mongoose';
import type { ProjectionType, QueryOptions, RootFilterQuery } from 'mongoose';

customMongooseOptions.beforeModelBuild = <DocType, Model extends BaseMongoosePaginateModel<DocType, InstanceMethodsAndOverrides, QueryHelpers>, InstanceMethodsAndOverrides = {}, QueryHelpers = {}>(
	schema: Schema<DocType, Model, InstanceMethodsAndOverrides, QueryHelpers>
) => {
	schema.static('findByRouteId', function (ctx: Context, projection?: Nullable<ProjectionType<DocType>>, options?: Nullable<QueryOptions<DocType>>) {
		return this.findById(ctx.req.param('id'), projection, options);
	});

	schema.static('findByRouteIdOrThrowNotFoundError', async function (ctx: Context, filterQuery?: RootFilterQuery<DocType>, projection?: Nullable<ProjectionType<DocType>>, options?: Nullable<QueryOptions<DocType>>) {
		const id = ctx.req.param('id');
		if (!id) createApiErrorAndThrow(404);
		if (!Types.ObjectId.isValid(id)) createApiErrorAndThrow(400);
		const document = await this.findOne({ ...filterQuery, _id: id }, projection, options);
		if (!document) createApiErrorAndThrow(404);
		return document;
	});
};

export default () => {};
