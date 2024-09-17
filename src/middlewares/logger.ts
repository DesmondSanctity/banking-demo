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
 const oldJson = res.json;
 res.json = function (data) {
  const logLevel = res.statusCode >= 400 ? 'error' : 'info';
  logger[logLevel](`${req.method} ${req.url}`, {
   ip: req.ip,
   userAgent: req.get('User-Agent'),
   responseData: data,
   statusCode: res.statusCode,
  });
  return oldJson.apply(res, [...arguments] as any);
 };

 next();
};


export const errorLoggerMiddleware = (
 err: any,
 req: Request,
 res: Response,
 next: NextFunction
) => {
 logger.error(`${req.method} ${req.url}`, {
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  errorMessage: err.message,
  errorStack: err.stack,
  statusCode: err.status || 500,
 });
 next(err);
};

export default logger;
