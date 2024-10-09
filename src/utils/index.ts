import { ApiError as _ApiError } from '@/classes/api-error';

declare global {
	var ApiError: typeof _ApiError;
}

globalThis.ApiError = _ApiError;
