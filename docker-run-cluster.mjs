import cluster from 'cluster';

if (cluster.isPrimary) {
	console.log(`Primary process ${process.pid} is running`);
	const workerCount = Number(process.env.CLUSTER_WORKERS) || 4;
	console.log(`Starting ${workerCount} worker processes`);
	for (let i = 0; i < workerCount; i++) cluster.fork();
	cluster.on('exit', (worker, code, signal) => {
		console.error(`Worker ${worker.process.pid} exited with code: ${code}, signal: ${signal}`);
		console.log('Attempting to restart worker in 3 seconds...');
		setTimeout(() => {
			const newWorker = cluster.fork();
			console.log(`New worker ${newWorker.process.pid} started`);
		}, 3000);
	});
} else import('./index.mjs').then(() => console.log(`Worker ${process.pid} started successfully`)).catch((error) => console.error(`Worker ${process.pid} failed to start: ${error.message}`));
