import { setupServerErrorHandling } from '@kikiutils/kiki-core-stack-pack/hyper-express-backend/setups/error-handling';
import '@kikiutils/kiki-core-stack-pack/hyper-express-backend/setups/mongoose-model-statics';
import logger from '@kikiutils/node/consola';

import '@/core/globals';
import { sessionMiddleware } from '@/core/middlewares/session';
import { registerRoutesFromFiles } from '@/core/route';
import '@/globals';
import { adminMiddleware } from '@/middlewares/admin';
import { apiResponseMiddleware } from '@/middlewares/api-response';
import { server } from '@/server';

// Setup error handling
setupServerErrorHandling(server);

// Setup middlewares
server.use('/api', apiResponseMiddleware(), await sessionMiddleware(), adminMiddleware());

// Scan files and register routes
await registerRoutesFromFiles(server, `${import.meta.dirname}/apis`, '/api');
await registerRoutesFromFiles(server, `${import.meta.dirname}/routes`, '/');

// Start server
const serverHost = process.env.SERVER_HOST || '127.0.0.1';
const serverPort = +(process.env.SERVER_PORT || 8000);
await server.listen(serverPort, serverHost);
logger.info(`Server started on http://${serverHost}:${serverPort}`);
