// Initialize Mongoose
await import('@kikiutils/kiki-core-stack-pack/hono-backend/setups/mongoose');

// Initialize global utilities
await import('@kikiutils/kiki-core-stack-pack/hono-backend/globals');

// Import and setup server
const server = (await import('@kikiutils/kiki-core-stack-pack/hono-backend/server')).default;
await import('@kikiutils/kiki-core-stack-pack/hono-backend/setups/server');

// Load middlewares
await import('@/middlewares');

// Begin loading API routes - do not change or remove this line
await import('@kikiutils/kiki-core-stack-pack/hono-backend/setups/apis');
// End loading API routes - do not change or remove this line

export default server;
