// Initialize Mongoose setup
import '@kikiutils/kiki-core-stack-pack/hono-backend/setups/mongoose-model-statics';

// Initialize global utilities
await import('@/globals');

// Import and set up the server
const { default: server } = await import('@/server');
await import('@kikiutils/kiki-core-stack-pack/hono-backend/setups/error-handling');

// Begin logger setup - block content can be changed but do not remove this block
const { useHonoLogger } = await import('@kikiutils/node/hono');
useHonoLogger(honoApp);
// End logger setup - block content can be changed but do not remove this block

// Load middlewares
await import('@/middlewares');

// Begin routes setup - block content can be changed but do not remove this block
const { registerRoutesFromFiles } = await import('@/core/register-routes');
await registerRoutesFromFiles(honoApp, 'src/apis', '/api');
// End routes setup - block content can be changed but do not remove this block

export default server;
