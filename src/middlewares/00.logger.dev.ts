import { logger as honoLogger } from 'hono/logger';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

import { honoApp } from '@/core/app';

const pinoLogger = pino(
    {},
    pinoPretty({
        colorize: true,
        ignore: 'hostname,pid',
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    }),
);

honoApp.use(honoLogger((text) => text[0] !== '<' && pinoLogger.info(text.substring(4))));
