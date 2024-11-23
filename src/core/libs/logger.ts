import consola from 'consola';
import { colorize } from 'consola/utils';
import { pid } from 'node:process';

const logPrefix = Bun.argv.includes('--is-subprocess') ? colorize('cyan', `[Worker ${Bun.argv[2]} (${pid})]`) : colorize('green', '[Main worker]');
export const logger = {
    error: (message: string, ...args: any[]) => consola.error(logPrefix, message, ...args),
    info: (message: string, ...args: any[]) => consola.info(logPrefix, message, ...args),
    success: (message: string, ...args: any[]) => consola.success(logPrefix, message, ...args),
    warn: (message: string, ...args: any[]) => consola.warn(logPrefix, message, ...args),
};

export default logger;
