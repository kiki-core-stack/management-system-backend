import configs from '@/configs';
import { honoApp } from '@/core/app';
import session from '@/core/middlewares/session';
import { cookieSessionTokenHandler } from '@/core/middlewares/session/handlers/token';

honoApp.use('/api/*', session(configs.sessionCipherKey, cookieSessionTokenHandler));
