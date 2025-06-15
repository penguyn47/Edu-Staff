// services/logger.ts
import { createLogger, format, transports, Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Định nghĩa các cấp độ log tùy chỉnh (nếu cần)
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    http: 'green',
    debug: 'blue',
  },
};

const getLogger = (): Logger => {
  const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
    format.colorize({ all: true })
  );

  const logger = createLogger({
    levels: customLevels.levels,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          logFormat
        ),
      }),
      new DailyRotateFile({
        filename: 'logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: format.combine(format.timestamp(), format.json()),
      }),
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        format: format.combine(format.timestamp(), format.json()),
      }),
    ],
    exitOnError: false,
  });

  return logger;
};

export const logger = getLogger();