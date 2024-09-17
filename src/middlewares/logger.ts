import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { nodeEnv } from '../config/app.config.js';

const logger = winston.createLogger({
 level: 'info',
 format: winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
 ),
 transports: [
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
  new winston.transports.File({ filename: 'combined.log' }),
 ],
});

if (nodeEnv !== 'production') {
 logger.add(
  new winston.transports.Console({
   format: winston.format.simple(),
  })
 );
}

export const loggerMiddleware = (
 req: Request,
 res: Response,
 next: NextFunction
) => {
 logger.info(`${req.method} ${req.url}`, {
  ip: req.ip,
  userAgent: req.get('User-Agent'),
 });
 next();
};

export default logger;
