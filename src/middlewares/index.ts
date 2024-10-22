import { useHonoLogger } from '@kikiutils/node/hono';

import { honoApp } from '@/app';
import configs from '@/configs';
import session from '@/core/middlewares/session';
import { cookieSessionTokenHandler } from '@/core/middlewares/session/handlers/token';
import api from './api';

useHonoLogger(honoApp);
honoApp.use('/api/*', session(configs.sessionEncryptionKey, cookieSessionTokenHandler));
honoApp.use('/api/*', api);
