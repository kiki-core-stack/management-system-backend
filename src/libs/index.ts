import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';

export function assertNotModifiedAndStripData<T extends { updatedAt: string }>(
    payload: T,
    document: { updatedAt: Date },
) {
    const { updatedAt, ...data } = payload;
    if (updatedAt !== document.updatedAt.toISOString()) throwApiError(409, '該資料已被修改');
    return data;
}
