// Initialize Mongoose
import '@/setups/mongoose';

// Initialize global utilities
import '@/globals';

// Import and setup server
import { default as server } from '@/server';
import '@/setups/server';

// Scan and load apis routes
import '@/setups/apis-routes';

export default server;
