import { z } from 'zod';

export const createAccountSchema = z.object({
 userId: z.string(),
});

export const updateAccountSchema = z.object({
 balance: z.number().positive().optional(),
});
