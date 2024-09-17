import { z } from 'zod';

export const registerUserSchema = z.object({
 name: z.string().min(2),
 email: z.string().email(),
 password: z.string().min(6),
});

export const loginUserSchema = z.object({
 email: z.string().email(),
 password: z.string(),
});

export const updateUserSchema = z.object({
 name: z.string().min(2).optional(),
 email: z.string().email().optional(),
 password: z.string().min(6).optional(),
});
