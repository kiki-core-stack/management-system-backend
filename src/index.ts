// Initialize Mongoose setup
import '@/setups/mongoose';

// Initialize global utilities
await import('@/core/globals');
await import('@/globals');

// Import and set up the server
const { default: server } = await import('@/server');
await import('@/setups/error-handling');

// Begin logger setup - block content can be changed but do not remove this block
const { useHonoLogger } = await import('@kikiutils/node/hono');
useHonoLogger(honoApp);
// End logger setup - block content can be changed but do not remove this block

// Load middlewares
await import('@/middlewares');

// Begin routes setup - block content can be changed but do not remove this block
const { registerRoutesFromFiles } = await import('@/core/register-routes');
await registerRoutesFromFiles(honoApp, 'src/apis', '/api');
await registerRoutesFromFiles(honoApp, 'src/routes', '/');
// End routes setup - block content can be changed but do not remove this block

export default server;
