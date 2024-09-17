import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { nodeEnv } from '../config/app.config.js';

const sensitiveFields = ['password', 'token', 'secret'];

const logger = winston.createLogger({
 level: 'info',
 format: winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
 ),
 transports: [
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
  new winston.transports.File({ filename: 'info.log' }),
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
  const sanitizedData = sanitizeLog(data);
  const logLevel = res.statusCode >= 400 ? 'error' : 'info';
  logger[logLevel](`${req.method} ${req.url}`, {
   ip: req.ip,
   userAgent: req.get('User-Agent'),
   responseData: sanitizedData,
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

const sanitizeLog = (data: any): any => {
 if (typeof data !== 'object' || data === null) {
  return data;
 }

 const sanitized: { [key: string]: any } = Array.isArray(data) ? [] : {};

 for (const [key, value] of Object.entries(data)) {
  if (sensitiveFields.includes(key.toLowerCase())) {
   sanitized[key] = '******';
  } else if (typeof value === 'object') {
   sanitized[key] = sanitizeLog(value);
  } else {
   sanitized[key] = value;
  }
 }

 return sanitized;
};

export default logger;
