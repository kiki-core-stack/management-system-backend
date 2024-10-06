import cluster from 'cluster';

if (cluster.isPrimary) {
	console.log(`Primary process ${process.pid} is running`);
	const clusterWorkers = +process.env.NITRO_CLUSTER_WORKERS || (await import('os')).cpus().length;
	console.log(`Forking ${clusterWorkers} workers`);
	for (let i = 0; i < clusterWorkers; i++) cluster.fork();
	cluster.on('exit', (worker, code, signal) => {
		console.log(`Worker ${worker.process.pid} died`);
		console.log('Waiting 3 seconds before forking a new worker...');
		setTimeout(() => {
			console.log('Starting a new worker');
			cluster.fork();
		}, 3000);
	});
} else {
	let listener;
	try {
		listener = (await import('./.output/server/index.mjs')).listener;
	} catch {
		try {
			listener = (await import('./index.mjs')).listener;
		} catch {}
	}

	if (!listener) throw new Error('No listener found');
	const listenHost = process.env.NITRO_HOST || '127.0.0.1';
	const listenPort = process.env.NITRO_PORT || 8000;
	const server = (await import('http')).createServer(listener);
	server.on('error', (error) => console.error(`Server encountered an error: ${error}`));
	server.listen(listenPort, listenHost, () => console.log(`Worker ${process.pid} started and listening on ${listenHost}:${listenPort}`));
}
