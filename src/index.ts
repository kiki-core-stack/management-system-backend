// Initialize Mongoose setup
import '@kikiutils/kiki-core-stack-pack/hono-backend/setups/mongoose';

// Initialize global utilities
import '@kikiutils/kiki-core-stack-pack/hono-backend/globals';

// Import and set up the server
import { default as server } from '@kikiutils/kiki-core-stack-pack/hono-backend/server';
import '@kikiutils/kiki-core-stack-pack/hono-backend/setups/server';

// Begin logger setup - block content can be changed but do not remove this block
import { useHonoLogger } from '@kikiutils/node/hono';
useHonoLogger(honoApp);
// End logger setup - block content can be changed but do not remove this block

// Load middlewares
await import('@/middlewares');

// Begin API routes setup - block content can be changed but do not remove this block
await import('@kikiutils/kiki-core-stack-pack/hono-backend/setups/apis');
// End API routes setup - block content can be changed but do not remove this block

export default server;
