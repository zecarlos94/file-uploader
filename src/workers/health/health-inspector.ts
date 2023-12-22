import { Options } from 'express-rate-limit';
import { parentPort } from 'worker_threads';
import config from 'src/config';
import logger from 'src/logger/logger';
import os from 'os';
import os2 from 'os-utils';

let intervalRef: NodeJS.Timeout;

parentPort?.on('message', (message: { periodicity: number }) => {
    logger.debug(`Received periodicity from main thread: ${message.periodicity}`);

    if (intervalRef) {
        clearInterval(intervalRef);
    }

    intervalRef = setInterval(async () => {
        const cpuFreePromise = new Promise<number>((resolve, _) => {
            os2.cpuFree((value: number) => {
                resolve(value);
            });
        });

        const cpuUsagePromise = new Promise<number>((resolve, _) => {
            os2.cpuUsage((value: number) => {
                resolve(value);
            });
        });

        const [cpuUsage, cpuFree]: [number, number] = await Promise.all([cpuUsagePromise, cpuFreePromise]);

        const freeMemory = os.freemem();
        const totalMemory = os.totalmem();
        const remainingMemory = Math.round(freeMemory / totalMemory);

        if (cpuFree < 0.25 || cpuUsage > 0.75 || remainingMemory < 0.25) {
            // decrease rate limiter by 50% for demo purposes
            parentPort?.postMessage({
                limit: Math.floor(config.rateLimiter.limit * 0.5),
                standardHeaders: true,
                windowMs: Math.floor(config.rateLimiter.windowMs * 0.5)
            } as Partial<Options>);
        }
    }, message.periodicity);
});