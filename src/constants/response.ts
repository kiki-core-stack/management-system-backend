import type { StatusCode } from 'hono/utils/http-status';

export const jsonResponseHeaders = Object.freeze({ 'Content-Type': 'application/json' });
export const successResponseText = JSON.stringify(createApiSuccessResponseData());
export const statusCodeToMessageMap = Object.freeze<Partial<Record<StatusCode, string>>>({
	200: '成功',
	400: '資料格式錯誤或是非法操作！',
	401: '尚未登入！',
	403: '沒有權限！',
	404: '找不到資料！',
	409: '欄位值重複或是該資料使用中！',
	413: '檔案大小超出限制！',
	500: '系統錯誤！'
});
