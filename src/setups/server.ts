import logger from '@kikiutils/node/consola';
import { mongo } from 'mongoose';

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

const internalServerError = new ApiError(500);
const notFoundError = new ApiError(404);
const responseHeaders = Object.freeze({ 'Content-Type': 'application/json' });
honoApp.notFound((ctx) => ctx.text(notFoundError.message, notFoundError.statusCode, responseHeaders));
honoApp.onError((error, ctx) => {
	let apiError;
	if (error instanceof ApiError) apiError = error;
	else if (error instanceof mongo.MongoServerError && error.code) apiError = new ApiError(mongodbErrorCodeToHttpStatusCodeMap[error.code] || 500);
	if (!apiError) {
		apiError = internalServerError;
		logger.error(error);
	}

	return ctx.text(apiError.message, apiError.statusCode, responseHeaders);
});
