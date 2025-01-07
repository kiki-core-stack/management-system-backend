import { createConsola } from 'consola';
import type { InputLogObject } from 'consola';
import { colorize } from 'consola/utils';

const consola = createConsola({ formatOptions: { date: false } });
const formatDate = (date: Date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
const createLogDateTimePrefix = () => `[${formatDate(new Date())}]`;
const logPrefix = Bun.argv.includes('--is-subprocess') ? colorize('cyan', `[Worker ${Bun.argv[2]} (${process.pid})]`) : colorize('green', '[Main worker]');
export const logger = {
    error: (...args: any[]) => consola.error(createLogDateTimePrefix(), logPrefix, ...args),
    info: (...args: any[]) => consola.info(createLogDateTimePrefix(), logPrefix, ...args),
    success: (...args: any[]) => consola.success(createLogDateTimePrefix(), logPrefix, ...args),
    warn: (...args: any[]) => consola.warn(createLogDateTimePrefix(), logPrefix, ...args),
};

export default logger;
