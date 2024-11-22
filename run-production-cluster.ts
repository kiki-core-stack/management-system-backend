import type { Subprocess } from 'bun';
import { env, on } from 'node:process';

// TODO: logger, auto restart and compile this file

(() => {
	const workersCount = Number(env.CLUSTER_WORKERS) || 4;
	const subprocesses: Subprocess[] = Array.from({ length: workersCount });
	for (let i = 0; i < workersCount; i++) subprocesses[i] = Bun.spawn({ cmd: ['./index'], stdio: ['pipe', 'pipe', 'pipe'] });
	const killAllSubprocesses = (exitCode?: NodeJS.Signals | number) => subprocesses.forEach((subprocess) => subprocess.kill(exitCode));
	on('SIGINT', killAllSubprocesses);
	on('exit', killAllSubprocesses);
})();
