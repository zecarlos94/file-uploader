import 'reflect-metadata';
import { DynamicRateLimiter } from 'src/utils/common/dynamic-rate-limiter';
import { getCorsAllowedOrigins } from 'src/utils/common/cors';
import { json, urlencoded } from 'body-parser';
import { morganLoggerMiddleware } from 'src/middlewares/common/logger';
import { Options } from 'express-rate-limit';
import { prometheusTelemetryMetricsMiddleware } from 'src/middlewares/common/telemetry';
import { requestIdMiddleware } from 'src/middlewares/common/request-id';
import { setupDI } from 'src/di/register';
import { isMainThread, Worker } from 'worker_threads';
import config from 'src/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'src/logger/logger';
import path from 'path';
import router from 'src/router';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors({
  credentials: true,
  optionsSuccessStatus: 200,
  origin: getCorsAllowedOrigins()
}));

app.options(
  getCorsAllowedOrigins(),
  cors({
    credentials: true,
    optionsSuccessStatus: 200,
    origin: true,
  })
);

app.use(cookieParser());

app.use(express.static('public'));

app.use(json());

app.use(
  urlencoded({
    extended: true,
  })
);

app.use(requestIdMiddleware);

app.use(morganLoggerMiddleware);

app.use(prometheusTelemetryMetricsMiddleware);

app.use(router);

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger-spec/swagger.json',
    },
  })
);

app.use((_, res) => {
  res.status(404).send("Sorry, the page you are looking for does not exist.");
});

setupDI();

if (isMainThread) {
  const healthInspectorWorker = new Worker(
    path.resolve(__dirname, './workers/health/health-inspector.ts'), 
    { workerData: { periodicity: config.rateLimiter.refreshMs } }
  );

  healthInspectorWorker.postMessage({ periodicity: config.rateLimiter.refreshMs });

  healthInspectorWorker.on('message', (options: Partial<Options>) => {
    logger.debug(`Received rate limiter options from health inspector worker thread: ${JSON.stringify(options)}`);
    DynamicRateLimiter.set(options);
  });
}

export default app;