import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/app.config.js';

export const authenticate = (
 req: Request,
 res: Response,
 next: NextFunction
) => {
 const authHeader = req.headers.authorization;
 if (!authHeader) {
  return res.status(401).json({ message: 'No token provided' });
 }

 const token = authHeader.split(' ')[1];
 try {
  const decoded = jwt.verify(token, jwtSecret!);
  (req as any).user = decoded;
  next();
 } catch (error) {
  res.status(401).json({ message: 'Invalid token' });
 }
};
