import logger from '@kikiutils/node/consola';

import { server } from '@/server';

const serverHost = process.env.SERVER_HOST || '127.0.0.1';
const serverPort = +(process.env.SERVER_PORT || 8000);
await server.listen(serverPort, serverHost);
logger.info(`Server started on http://${serverHost}:${serverPort}`);
