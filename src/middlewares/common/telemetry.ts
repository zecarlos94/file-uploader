import config from 'src/config';
import promBundle from 'express-prom-bundle';

export const prometheusTelemetryMetricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  metricsPath: config.telemetry.metricsPath,
  promClient: {
    collectDefaultMetrics: {
      labels: { 
        serviceName: config.serviceName 
      }
    }
  }
});