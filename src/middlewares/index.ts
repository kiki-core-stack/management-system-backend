import { useHonoLogger } from '@kikiutils/node/hono';

import { honoApp } from '@/app';
import configs from '@/configs';
import session from '@/core/middlewares/session';
import { cookieSessionTokenHandler } from '@/core/middlewares/session/handlers/token';

useHonoLogger(honoApp);
// @ts-expect-error
honoApp.use('/api', session(configs.sessionDataEncryptionKey, cookieSessionTokenHandler));
