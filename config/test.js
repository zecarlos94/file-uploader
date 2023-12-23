module.exports = {
  authentication: {
    basicAuth: {
      enabled: true,
      password: '123456',
      username: 'user'
    }
  },
  cors: {
    corsDomainList: '*'
  },
  files: {
    upload: {
      allowedMimeTypes: 'csv',
      destination: 'file-uploads-tests',
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
