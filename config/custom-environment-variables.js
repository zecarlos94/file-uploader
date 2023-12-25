module.exports = {
  authentication: {
    basicAuth: {
      enabled: 'AUTHENTICATION_BASIC_AUTH_ENABLED',
      password: 'AUTHENTICATION_BASIC_AUTH_PASSWORD',
      username: 'AUTHENTICATION_BASIC_AUTH_USERNAME'
    }
  },
  circuitBreaker: {
    halfOpenAfterMs: 'CIRCUIT_BREAKER_HALF_OPEN_AFTER_MS',
    maxExecutionsAttemptsBeforePause: 'CIRCUIT_BREAKER_MAX_EXECUTIONS_ATTEMPTS_BEFORE_PAUSE',
  },
  cors: {
    corsDomainList: 'CORS_DOMAIN_LIST'
  },
  files: {
    upload: {
      allowedMimeTypes: 'FILES_UPLOAD_ALLOWED_MIME_TYPES',
      destination: 'FILES_UPLOAD_DESTINATION',
      maxFileSize: 'FILES_UPLOAD_MAX_FILE_SIZE',
      maxFilesPerRequest: 'FILES_UPLOAD_MAX_FILES_PER_REQUEST',
      useOnlyMulter: 'FILES_UPLOAD_USE_ONLY_MULTER'
    }
  },
  host: 'HOST',
  logger: {
    level: 'LOGGER_LEVEL'
  },
  rateLimiter: {
    limit: 'RATE_LIMITER_LIMIT',
    refreshMs: 'RATE_LIMITER_REFRESH_MS',
    windowMs: 'RATE_LIMITER_WINDOW_MS'
  },
  retries: {
    maxAttempts: 'RETRIES_MAX_ATTEMPTS'
  },
  server: {
    clustering: 'SERVER_CLUSTERING',
    port: 'SERVER_PORT'
  },
  serviceName: 'SERVICE_NAME',
  telemetry: {
    enabled: 'TELEMETRY_ENABLED',
    metricsPath: 'TELEMETRY_METRICS_PATH'
  }
};