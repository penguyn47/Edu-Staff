import { createLogger, format, transports, Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const getLogger = (): Logger => {
  const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  );

  const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Chỉ ghi debug trong dev
    format: logFormat,
    transports: [
      // Ghi log ra console
      new transports.Console(),
      // Ghi log ra file, xoay vòng hàng ngày
      new DailyRotateFile({
        filename: 'logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m', // Kích thước tối đa mỗi file
        maxFiles: '14d', // Lưu trữ log trong 14 ngày
        format: format.combine(format.timestamp(), format.json()), // File log dùng JSON
      }),
    ],
    exitOnError: false,
  });

  return logger;
};

export const logger = getLogger();