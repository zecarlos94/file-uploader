module.exports = {
  authentication: {
    basicAuth: {
      enabled: true,
      password: '123456',
      username: 'user'
    }
  },
  circuitBreaker: {
    halfOpenAfterMs: 10 * 1000,
    maxExecutionsAttemptsBeforePause: 5,
  },
  cors: {
    corsDomainList: '*'
  },
  files: {
    upload: {
      allowedMimeTypes: 'csv,xlsx,xls',
      destination: 'file-uploads',
      maxFileSize: '300MB',
      maxFilesPerRequest: 2,
      useOnlyMulter: false
    }
  },
  host: 'localhost',
  logger: {
    datePattern: 'YYYY-MM-DD',
    format: 'text',
    level: 'debug',
    maxFiles: '30d',
    maxSize: '20m',
    zippedArchive: 'false'
  },
  rateLimiter: {
    limit: 1,
    refreshMs: 60 * 1000,
    windowMs: 10 * 1000
  },
  retries: {
    maxAttempts: 5
  },
  server: {
    clustering: false,
    port: 3001
  },
  serviceName: 'file-upload',
  telemetry: {
    enabled: false,
    metricsPath: '/metrics'
  }
};
