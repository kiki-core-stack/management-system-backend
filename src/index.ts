import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z as zod } from '@kikiutils/kiki-core-stack-pack/constants/zod';
import { setupHonoAppErrorHandling } from '@kikiutils/kiki-core-stack-pack/hono-backend/setups/error-handling';
import '@kikiutils/kiki-core-stack-pack/hono-backend/setups/mongoose-model-statics';
import type { Serve } from 'bun';

import { honoApp } from '@/app';
import { registerRoutesFromFiles } from '@/core/libs/route';
import '@/configs';

// Extend Zod with OpenAPI
extendZodWithOpenApi(zod);

// Import global constants and utilities
await import('@/core/globals');
await import('@/globals');

// Setup error handling
setupHonoAppErrorHandling(honoApp);

// Scan files and register routes
await registerRoutesFromFiles(honoApp, `${import.meta.dirname}/apis`, '/api');
await registerRoutesFromFiles(honoApp, `${import.meta.dirname}/routes`, '/');

// Start server
const serveConfig: Serve = {
	fetch: honoApp.fetch,
	hostname: process.env.SERVER_HOST || '127.0.0.1',
	port: Number(process.env.SERVER_PORT) || 8000,
	reusePort: true
};

export default serveConfig;
