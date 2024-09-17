import { z } from 'zod';

export const sendMoneySchema = z.object({
 fromAccountId: z.string(),
 toAccountNumber: z.string(),
 amount: z.number().positive(),
});

export const updateTransactionSchema = z.object({
 amount: z.number().positive().optional(),
 type: z.string().optional(),
});
