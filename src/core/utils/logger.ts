import { createConsola } from 'consola';
import type { InputLogObject } from 'consola';
import { colorize } from 'consola/utils';
import { format } from 'date-fns';
import { pid } from 'node:process';

const consola = createConsola({ formatOptions: { date: false } });
const createLogDateTimePrefix = () => `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')}]`;
const logPrefix = Bun.argv.includes('--is-subprocess') ? colorize('cyan', `[Worker ${Bun.argv[2]} (${pid})]`) : colorize('green', '[Main worker]');
export const logger = {
    error: (message: any | InputLogObject, ...args: any[]) => consola.error(createLogDateTimePrefix(), logPrefix, message, ...args),
    info: (message: any | InputLogObject, ...args: any[]) => consola.info(createLogDateTimePrefix(), logPrefix, message, ...args),
    success: (message: any | InputLogObject, ...args: any[]) => consola.success(createLogDateTimePrefix(), logPrefix, message, ...args),
    warn: (message: any | InputLogObject, ...args: any[]) => consola.warn(createLogDateTimePrefix(), logPrefix, message, ...args),
};

export default logger;
