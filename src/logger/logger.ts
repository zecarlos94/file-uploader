/*
 * Module dependencies.
 */

import { Format } from 'logform';
import { createLogger, format, transports } from 'winston';
import DailyRotateFileTransport from 'winston-daily-rotate-file';
import config from 'config';


/*
 * Logger setup.
 */

const { 
  combine,
  errors,
  json,
  logstash,
  splat,
  timestamp 
} = format;

const datePattern: string = config.get('logger.datePattern');
const formatConfig: string = config.get('logger.format');
const maxFiles: string = config.get('logger.maxFiles');
const maxSize: string = config.get('logger.maxSize');
const serviceName: string = config.get('serviceName');
const zippedArchive: boolean = config.get('logger.zippedArchive') === 'true';

function text() {
  return format.printf((all) => {
    const { data, label, level, message, stack, timestamp } = all;
    const pid = process.pid.toString();

    return `${pid} ${timestamp} | (${level}) ${label ? `[${label}] ` : ''}${message || stack || ''} ${
      data ? JSON.stringify(data) : ''
    }`;
  });
}

function serializer(): Format {
  let serializer: Format;

  if (formatConfig === 'json') {
    serializer = json();
  } else if (formatConfig === 'logstash') {
    serializer = logstash();
  } else {
    serializer = text();
  }

  return serializer;
}

const logger = createLogger({
  defaultMeta: {
    service: serviceName,
  },
  level: config.get('logger.level'),
  transports: [
    new DailyRotateFileTransport({
      datePattern,
      dirname: 'logs',
      filename: `${serviceName}-%DATE%.log`,
      format: combine(
        errors({ stack: true }),
        splat(), 
        timestamp(), 
        serializer()
      ),
      maxFiles,
      maxSize,
      zippedArchive
    }),
    new transports.Console({
      format: combine(
        errors({ stack: true }),
        splat(), 
        timestamp(), 
        serializer()
      ),
    }),
  ],
});

export default logger;