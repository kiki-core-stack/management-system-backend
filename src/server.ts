import type { Serve } from 'bun';
import { Hono } from 'hono';

declare global {
	var honoApp: typeof _honoApp;
}

const _honoApp = new Hono();
globalThis.honoApp = _honoApp;

export default {
	fetch: _honoApp.fetch,
	hostname: process.env.SERVER_HOST ?? '127.0.0.1',
	port: +(process.env.SERVER_PORT ?? 8000),
	reusePort: true
} satisfies Serve;
