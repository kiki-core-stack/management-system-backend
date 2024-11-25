import type { Subprocess } from 'bun';
import { colorize } from 'consola/utils';
import process from 'node:process';

import logger from '@/core/utils/logger';

(() => {
    let isShuttingDown = false;
    const workersCount = Number(process.env.CLUSTER_WORKERS) || 4;
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
                if (error) logger.error(logPrefix, `Exited with error:`, error);
                else if (exitCode !== null) logger.info(logPrefix, `Exited with exitCode ${exitCode}.`);
                else if (signalCode !== null) logger.info(logPrefix, `Exited with signalCode ${signalCode}.`);
                else logger.info(logPrefix, 'Exited with unknown reason.');
                if (isShuttingDown) return logger.info(logPrefix, 'Main process is shutting down. Do not restart.');
                logger.info(logPrefix, 'Restarting in 1 second...');
                setTimeout(() => !isShuttingDown && createAndSetWorker(index), 1000);
            },
            stdio: ['inherit', 'inherit', 'inherit'],
        });

        workerProcesses[index] = { logPrefix: colorize('cyan', `[Worker ${index} (${subprocess.pid})]`), subprocess };
    };

    logger.info(`Starting ${workersCount} workers...`);
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

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
    process.once('exit', shutdown);
})();
