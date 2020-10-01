import { createLogger, format, transports } from 'winston';

const { combine, colorize, json, timestamp } = format;

const logger = createLogger({
  level: 'info',
  format: combine(json(), timestamp()),
  transports: [
    new transports.Console({
      format: combine(json(), colorize()),
    }),
  ],
});

export default logger;
