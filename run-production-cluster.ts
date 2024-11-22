import type { Subprocess } from 'bun';
import process from 'node:process';

// TODO: logger, auto restart and compile this file

(() => {
	const workersCount = Number(process.env.CLUSTER_WORKERS) || 4;
	const subprocesses: Subprocess[] = Array.from({ length: workersCount });
	for (let i = 0; i < workersCount; i++) subprocesses[i] = Bun.spawn({ cmd: ['./index'], stdio: ['inherit', 'inherit', 'inherit'] });
	const killAllSubprocesses = (exitCode?: NodeJS.Signals | number) => subprocesses.forEach((subprocess) => subprocess.kill(exitCode));
	process.on('SIGINT', killAllSubprocesses);
	process.on('exit', killAllSubprocesses);
})();
