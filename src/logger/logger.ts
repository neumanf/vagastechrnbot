import winston from 'winston';

const { printf, combine, timestamp } = winston.format;

const format = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    format
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
  logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
}