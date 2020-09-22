import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(format.json(), format.colorize()),
  defaultMeta: { service: 'user-service' },
  transports: [new transports.Console()],
});

export default logger;
