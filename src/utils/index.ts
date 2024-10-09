import { ApiError as _ApiError } from '@/classes/api-error';
import './api-response';

declare global {
	var ApiError: typeof _ApiError;
}

globalThis.ApiError = _ApiError;
