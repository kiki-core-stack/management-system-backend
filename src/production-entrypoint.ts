import type { Subprocess } from 'bun';
import { colorize } from 'consola/utils';
import { env, once } from 'node:process';

import logger from '@/core/libs/logger';

(() => {
    let isShuttingDown = false;
    const workersCount = Number(env.CLUSTER_WORKERS) || 4;
    const workerProcesses: { logPrefix: string; subprocess: Subprocess }[] = Array.from({ length: workersCount });
    const createAndSetWorker = (index: number) => {
        const subprocess = Bun.spawn({
            cmd: [
                'bun',
                'run',
                './index.js',
                index.toString(),
                '--is-subprocess',
            ],
            onExit(_subprocess, exitCode, signalCode, error) {
                const logPrefix = workerProcesses[index]!.logPrefix;
                if (error || exitCode) {
                    logger.error(logPrefix, `Exited with exitCode ${exitCode} and error:`, error);
                    if (isShuttingDown) return logger.info(logPrefix, 'Main process is shutting down. Do not restart.');
                    logger.info(logPrefix, 'Restarting in 1 second...');
                    setTimeout(() => !isShuttingDown && createAndSetWorker(index), 1000);
                } else if (exitCode !== null) logger.info(logPrefix, `Exited with code: ${exitCode}.`);
                else if (signalCode !== null) logger.info(logPrefix, `Exited with signal: ${signalCode}.`);
                else logger.info(logPrefix, `Exited.`);
            },
            stdio: ['inherit', 'inherit', 'inherit'],
        });

        workerProcesses[index] = { logPrefix: colorize('cyan', `[Worker ${index} (${subprocess.pid})]`), subprocess };
    };

    for (let i = 0; i < workersCount; i++) createAndSetWorker(i);
    const shutdown = async (exitCode?: NodeJS.Signals | number) => {
        if (isShuttingDown) return;
        isShuttingDown = true;
        logger.info('Shutting down all workers...');
        await Promise.all(
            workerProcesses.map(async ({ logPrefix, subprocess }) => {
                logger.info(logPrefix, 'Killing...');
                subprocess.kill(exitCode);
                await subprocess.exited;
                logger.success(logPrefix, 'Exited.');
            }),
        );

        logger.info('All workers terminated.');
    };

    once('SIGINT', shutdown);
    once('SIGTERM', shutdown);
    once('exit', shutdown);
})();
