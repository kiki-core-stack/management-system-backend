import type { Request } from '@kikiutils/hyper-express';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';

declare global {
	const getXForwardedForHeaderFirstValue: (request: Request) => string | undefined;
}

setReadonlyConstantToGlobalThis('getXForwardedForHeaderFirstValue', (request: Request) => {
	const xForwardedFor = request.headers['x-forwarded-for'];
	if (!xForwardedFor) return;
	const firstCommaIndex = xForwardedFor.indexOf(',');
	const value = firstCommaIndex === -1 ? xForwardedFor : xForwardedFor.substring(0, firstCommaIndex);
	return value.trim();
});
