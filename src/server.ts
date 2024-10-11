import { OpenAPIHono } from '@hono/zod-openapi';
import { jsonResponseHeaders } from '@kikiutils/kiki-core-stack-pack/hono-backend/constants/response';
import { statusCodeToResponseTextMap } from '@kikiutils/kiki-core-stack-pack/hono-backend/constants/response/status-code-to-text-map';
import logger from '@kikiutils/node/consola';
import type { Serve } from 'bun';

declare global {
	var honoApp: typeof _honoApp;
}

const _honoApp = new OpenAPIHono({
	defaultHook(result, ctx) {
		if (result.success) return;
		logger.info(result.error);
		return ctx.text(statusCodeToResponseTextMap[400]!, 400, jsonResponseHeaders);
	}
});

globalThis.honoApp = _honoApp;

export default {
	fetch: _honoApp.fetch,
	hostname: process.env.SERVER_HOST || '127.0.0.1',
	port: +(process.env.SERVER_PORT || 8000),
	reusePort: true
} satisfies Serve;
