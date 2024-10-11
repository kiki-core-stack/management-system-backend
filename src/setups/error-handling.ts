import type { StatusCode } from 'hono/utils/http-status';
import logger from '@kikiutils/node/consola';
import { mongo } from 'mongoose';

import { jsonResponseHeaders } from '@/constants/response';
import { statusCodeToResponseTextMap } from '@/constants/response/status-code-to-text-map';

const mongodbErrorCodeToHttpStatusCodeMap = Object.freeze<Dict<StatusCode>>({
	2: 400, // BadValue -> Bad Request
	4: 404, // NoSuchKey -> Not Found
	6: 503, // HostUnreachable -> Service Unavailable
	7: 503, // HostNotFound -> Service Unavailable
	9: 400, // FailedToParse -> Bad Request
	13: 401, // Unauthorized -> Unauthorized
	14: 400, // TypeMismatch -> Bad Request
	16: 400, // InvalidLength -> Bad Request
	20: 400, // IllegalOperation -> Bad Request
	22: 400, // InvalidBSON -> Bad Request
	24: 504, // LockTimeout -> Gateway Timeout
	26: 404, // NamespaceNotFound -> Not Found
	27: 404, // IndexNotFound -> Not Found
	50: 504, // MaxTimeMSExpired -> Gateway Timeout
	66: 400, // ImmutableField -> Bad Request
	72: 400, // InvalidOptions -> Bad Request
	73: 400, // InvalidNamespace -> Bad Request
	89: 504, // NetworkTimeout -> Gateway Timeout
	11000: 409, // DuplicateKey -> Conflict
	13297: 409, // DatabaseDifferCase -> Conflict
	13436: 503, // NotPrimaryOrSecondary -> Service Unavailable
	14031: 507, // OutOfDiskSpace -> Insufficient Storage
	16755: 400 // Location16755 -> Bad Request
});

honoApp.notFound((ctx) => ctx.text(statusCodeToResponseTextMap[404]!, 404, jsonResponseHeaders));
honoApp.onError((error, ctx) => {
	if (error instanceof ApiError) return ctx.text(error.message, error.statusCode, jsonResponseHeaders);
	if (error instanceof mongo.MongoServerError && error.code) {
		const statusCode = mongodbErrorCodeToHttpStatusCodeMap[error.code] || 500;
		return ctx.text(statusCodeToResponseTextMap[statusCode]!, statusCode, jsonResponseHeaders);
	}

	logger.error(error);
	return ctx.text(statusCodeToResponseTextMap[500]!, 500, jsonResponseHeaders);
});
