import { z } from 'zod';
import { Types } from 'mongoose';

export const createAccountSchema = z.object({
 userId: z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
 }),
 description: z.string(),
});

export const updateAccountSchema = z.object({
 description: z.string().optional(),
});
