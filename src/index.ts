// Initialize Mongoose
import '@kikiutils/kiki-core-stack-pack/hono-backend/setups/mongoose';

// Initialize global utilities
import '@kikiutils/kiki-core-stack-pack/hono-backend/globals';

// Import and setup server
import { default as server } from '@kikiutils/kiki-core-stack-pack/hono-backend/server';
import '@kikiutils/kiki-core-stack-pack/hono-backend/setups/server';

// Load middlewares
import '@/middlewares';

// Scan and load apis routes
import '@kikiutils/kiki-core-stack-pack/hono-backend/setups/apis';

export default server;
