import config from 'config';

export default {
  authentication: {
    basicAuth: {
      enabled: config.get('authentication.basicAuth.enabled') === true || config.get('authentication.basicAuth.enabled') === 'true',
      password: config.get('authentication.basicAuth.password') as string,
      username: config.get('authentication.basicAuth.username') as string
    }
  },
  circuitBreaker: {
    halfOpenAfterMs: parseInt(config.get('circuitBreaker.halfOpenAfterMs'), 10),
    maxExecutionsAttemptsBeforePause: parseInt(config.get('circuitBreaker.maxExecutionsAttemptsBeforePause'), 10)
  },
  cors: {
    corsDomainList: config.get('cors.corsDomainList') as string
  },
  files: {
    upload: {
      allowedMimeTypes: config.get('files.upload.allowedMimeTypes') as string,
      destination: config.get('files.upload.destination') as string,
      maxFileSize: config.get('files.upload.maxFileSize') as string,
      maxFilesPerRequest: parseInt(config.get('files.upload.maxFilesPerRequest'), 10),
      useOnlyMulter: config.get('files.upload.useOnlyMulter') === 'true' || config.get('files.upload.useOnlyMulter') === true
    }
  },
  host: config.get('host') as string,
  logger: {
    datePattern: config.get('logger.datePattern') as string,
    format: config.get('logger.format') as string,
    level: config.get('logger.level') as string,
    maxFiles: config.get('logger.maxFiles') as string,
    maxSize: config.get('logger.maxSize') as string,
    zippedArchive: config.get('logger.zippedArchive') === 'true' || config.get('logger.zippedArchive') === true
  },
  rateLimiter: {
    limit: parseInt(config.get('rateLimiter.limit'), 10),
    refreshMs: parseInt(config.get('rateLimiter.refreshMs'), 10),
    windowMs: parseInt(config.get('rateLimiter.windowMs'), 10)
  },
  retries: {
    maxAttempts: parseInt(config.get('retries.maxAttempts'), 10)
  },
  server: {
    clustering: config.get('server.clustering') === 'true' || config.get('server.clustering') === true,
    port: parseInt(config.get('server.port'), 10),
  },
  serviceName: config.get('serviceName') as string,
  telemetry: {
    enabled: config.get('telemetry.enabled') === true || config.get('telemetry.enabled') === 'true',
    metricsPath: config.get('telemetry.metricsPath') as string
  }
};
