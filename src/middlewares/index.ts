import { useHonoLogger } from '@kikiutils/node/hono';

import configs from '@/configs';
import { honoApp } from '@/core/app';
import session from '@/core/middlewares/session';
import { cookieSessionTokenHandler } from '@/core/middlewares/session/handlers/token';

import api from './api';

useHonoLogger(honoApp);
honoApp.use('/api/*', session(configs.sessionCipherKey, cookieSessionTokenHandler));
honoApp.use('/api/*', api);
