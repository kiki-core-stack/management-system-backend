import type { Request, Response } from '@kikiutils/hyper-express';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node/object';
import type { PaginateOptions } from 'mongoose';

declare global {
	const sendPaginatedModelDataResponse: {
		<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
			request: Request,
			response: Response,
			model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
			paginateOptions?: PaginateOptions,
			filterInFields?: Dict<string>,
			processObjectIdIgnoreFields?: string[]
		): Promise<void>;

		<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
			response: Response,
			model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
			queries: ProcessedApiRequestQueries,
			paginateOptions?: PaginateOptions
		): Promise<void>;
	};
}

setReadonlyConstantToGlobalThis(
	'sendPaginatedModelDataResponse',
	async <RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
		requestOrResponse: Request | Response,
		modelOrResponse: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | Response,
		modelOrQueries: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides> | ProcessedApiRequestQueries,
		paginateOptions?: PaginateOptions,
		filterInFields?: Dict<string>,
		processObjectIdIgnoreFields?: string[]
	) => {
		let paginatedData;
		let response = requestOrResponse;
		if ('json' in modelOrResponse) {
			paginatedData = await modelToPaginatedData(requestOrResponse as Request, modelOrQueries as BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>, paginateOptions, filterInFields, processObjectIdIgnoreFields);
			response = modelOrResponse;
		} else {
			paginatedData = await modelToPaginatedData(modelOrResponse as BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>, modelOrQueries as ProcessedApiRequestQueries, paginateOptions);
		}

		sendApiSuccessResponse(response as Response, paginatedData);
	}
);
