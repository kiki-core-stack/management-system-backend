declare global {
	type ApiError<D extends object = any> = _ApiError<D>;

	var ApiError: typeof _ApiError;
}

const statusCodeToMessageMap = Object.freeze<Dict<string>>({
	400: '資料格式錯誤或是非法操作！',
	401: '尚未登入！',
	403: '沒有權限！',
	404: '找不到資料！',
	409: '欄位值重複或是該資料使用中！'
});

class _ApiError<D extends object> extends Error {
	data: D;
	statusCode: StatusCode;

	constructor(statusCode?: StatusCode, data?: D, message?: string);
	constructor(statusCode?: StatusCode, message?: string, data?: D);
	constructor(statusCode: StatusCode = 500, arg1: any, arg2?: any) {
		if (typeof arg1 === 'string') [arg1, arg2] = [arg2, arg1];
		super(JSON.stringify({ data: arg1 || {}, message: arg2 || statusCodeToMessageMap[statusCode] || '系統錯誤！', success: false }));
		this.data = arg1;
		this.statusCode = statusCode;
		Error.captureStackTrace?.(this, this.constructor);
	}
}

globalThis.ApiError = _ApiError;
