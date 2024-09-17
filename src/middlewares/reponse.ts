import { Request, Response } from 'express';

export const errorHandler = (
 err: Error,
 req: Request,
 res: Response,
) => {
 console.error(err.stack);
 res.status(500).json({ message: 'Internal server error' });
};

export const successHandler = (
 req: Request,
 res: Response,
) => {
 res.status(200).json({ message: 'Success' });
};