/*
 * Module dependencies.
 */
import { cpus, freemem, hostname, loadavg, machine, platform, totalmem, type, uptime, version } from 'os';
import { Server } from 'http';
import { TerminusState, createTerminus } from '@godaddy/terminus';
import logger from 'src/logger/logger';

/*
 * Health Checks setup.
 */

const bytesToSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) {
    return 'N/A';
  }

  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);

  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }

  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

const getHealthCheckOfProcess = (state: TerminusState): object => {
  const { system, user } = process.cpuUsage();

  const { rss, heapTotal, heapUsed, external, arrayBuffers } = process.memoryUsage();

  return {
    cpuUsage: {
      system: system / 1000,
      user: user / 1000,
    },
    memoryUsage: {
      rss: bytesToSize(rss),
      heapTotal: bytesToSize(heapTotal),
      heapUsed: bytesToSize(heapUsed),
      external: bytesToSize(external),
      arrayBuffers: bytesToSize(arrayBuffers),
    },
    requestedAt: new Date().toISOString(),
    state: !state.isShuttingDown ? 'ready' : 'shutting-down',
    upTimeMs: process.uptime() * 1000
  };
}

const getHealthCheckOfSystem = (state: TerminusState): object => {
  return {
    cpus: cpus(),
    hostname: hostname(),
    loadavg: loadavg(),
    machine: machine(),
    memory: {
      freemem: freemem(),
      totalmem: totalmem()
    },
    platform: platform(),
    requestedAt: new Date().toISOString(),
    state: !state.isShuttingDown ? 'ready' : 'shutting-down',
    type: type(),
    upTimeMs: uptime() * 1000,
    version: version(),
  };
}

const healthLiveCheck = (check: { state: TerminusState }): Promise<object> => {
  // TODO: You can also check dependencies' liveness here, e.g database connection health/live check (i.e if is connected)
  return Promise.resolve(getHealthCheckOfSystem(check.state));
};

const healthReadyCheck = async (check: { state: TerminusState }): Promise<object> => {
  // TODO: You must also check dependencies' readiness here, e.g data connection health/ready check (i.e if is accepting/handling requests)
  return Promise.resolve(getHealthCheckOfSystem(check.state));
};

const onSignal = (): Promise<void> => {
  logger.info('server received SIGINT signal');

  return Promise.resolve();
};

export default function addHealthChecks(
  server: Server,
  signals?: string[],
) {
  createTerminus(server, {
    healthChecks: {
      '/health/live': healthLiveCheck,
      '/health/ready': healthReadyCheck,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, GET",
    },
    onSignal,
    signals: signals ?? ['SIGHUP', 'SIGINT', 'SIGTERM']
  });
}
