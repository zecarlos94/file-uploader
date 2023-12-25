import 'reflect-metadata';
import { cpus } from 'os';
import addGracefulShutdown from 'src/utils/common/shutdown';
import addHealthChecks from 'src/utils/common/health-checks';
import app from 'src/app';
import cluster from 'cluster';
import config from 'src/config';
import http from 'http';
import logger from 'src/logger/logger';

/*
 * Setup key events logs.
 */

process.on('unhandledRejection', (reason, promise) =>
  logger.error('Unhandled Rejection at: Promise ', promise, reason)
);

process.on('unhandledRejection', (reason) =>
  logger.error(`Unhandled Rejection at: Promise, reason: ${reason}`)
);

/*
 * Initialization logs.
 */

logger.info(`${config.serviceName} initialized!`);

/*
 * Setup server.
 */

const startServer = (): void => {
  logger.info('Server is now starting...');
  
  const server = http.createServer(app);

  server.listen(config.server.port, () => {
    addGracefulShutdown(server);
    addHealthChecks(server);
    logger.info(`Server listening on ${config.server.port}`);
  });
};

if (config.server.clustering === false) {
  startServer();
} else {
  if (cluster.isPrimary) {
    logger.info(`Primary ${process.pid} is running`);

    // Fork workers.
    const numCPUs = cpus().length;
    
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('disconnect', (worker) => {
      logger.info(`The worker #${worker.process.pid} has disconnected`);
    }); 

    cluster.on('exit', (worker, code, signal) => {
      logger.info(`worker #${worker.process.pid} is dead: ${worker.isDead()} on exit event with code ${code} and signal ${signal}`);
      cluster.fork();
    });

    cluster.on('fork', (worker) => {
      logger.info(`worker #${worker.process.pid} is dead: ${worker.isDead()} on fork event`);
    });
  } else {
    setTimeout(() => {
      startServer();

      logger.info(`Worker ${process.pid} started`);
    }, 1000);
  }
}

logger.info(`${config.serviceName} started on ${config.server.port}`);
