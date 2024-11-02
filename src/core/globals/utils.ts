import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { Context } from 'hono';

declare global {
	const getXForwardedForHeaderFirstValue: (ctx: Context) => string | undefined;
}

setReadonlyConstantToGlobalThis<typeof getXForwardedForHeaderFirstValue>('getXForwardedForHeaderFirstValue', (ctx) => {
	const xForwardedFor = ctx.req.header('x-forwarded-for');
	if (!xForwardedFor) return;
	const firstCommaIndex = xForwardedFor.indexOf(',');
	const value = firstCommaIndex === -1 ? xForwardedFor : xForwardedFor.substring(0, firstCommaIndex);
	return value.trim();
});
