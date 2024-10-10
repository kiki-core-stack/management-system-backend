// Initialize Mongoose setup
await import('@kikiutils/kiki-core-stack-pack/hono-backend/setups/mongoose');

// Initialize global utilities
await import('@kikiutils/kiki-core-stack-pack/hono-backend/globals');

// Import and set up the server
const server = (await import('@kikiutils/kiki-core-stack-pack/hono-backend/server')).default;
await import('@kikiutils/kiki-core-stack-pack/hono-backend/setups/server');

// Begin logger setup - block content can be changed but do not remove this block
const { useHonoLogger } = await import('@kikiutils/node/hono');
useHonoLogger(honoApp, false);
// End logger setup - block content can be changed but do not remove this block

// Load middlewares
await import('@/middlewares');

// Begin API routes setup - block content can be changed but do not remove this block
await import('@kikiutils/kiki-core-stack-pack/hono-backend/setups/apis');
// End API routes setup - block content can be changed but do not remove this block

export default server;
