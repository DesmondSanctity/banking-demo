import { Request, Response } from 'express';
import * as accountService from '../services/account.service.js';
import {
 CreateAccountRequest,
 UpdateAccountRequest,
 AccountResponse,
} from '../models/account.model.js';
import {
 createAccountSchema,
 updateAccountSchema,
} from '../validations/account.js';

export const createAccount = async (req: Request, res: Response) => {
 try {
  const userId = (req as any).user.id;
  const validatedData = createAccountSchema.parse(req.body);
  const newAccount: AccountResponse = await accountService.createAccount(
   {
    userId,
    description: validatedData.description,
   } as CreateAccountRequest
  );
  res
   .status(201)
   .json({ message: 'Account created successfully', account: newAccount });
 } catch (error: any) {
  res
   .status(400)
   .json({ message: 'Error creating account', error: error.message });
 }
};

export const getAccounts = async (req: Request, res: Response) => {
 try {
  const userId = (req as any).user.id;
  const accounts: AccountResponse[] = await accountService.getAccounts(userId);
  res.json(accounts);
 } catch (error: any) {
  res
   .status(500)
   .json({ message: 'Error fetching accounts', error: error.message });
 }
};

export const getAccountById = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  const account: AccountResponse | null = await accountService.getAccountById(
   id
  );
  if (account) {
   res.json(account);
  } else {
   res.status(404).json({ message: 'Account not found' });
  }
 } catch (error: any) {
  res
   .status(500)
   .json({ message: 'Error fetching account', error: error.message });
 }
};

export const updateAccount = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  const validatedData = updateAccountSchema.parse(req.body);
  const updatedAccount: AccountResponse = await accountService.updateAccount(
   id,
   validatedData as UpdateAccountRequest
  );
  res.json(updatedAccount);
 } catch (error: any) {
  res
   .status(400)
   .json({ message: 'Error updating account', error: error.message });
 }
};

export const deleteAccount = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  await accountService.deleteAccount(id);
  res.json({ message: 'Account deleted successfully' });
 } catch (error: any) {
  res
   .status(500)
   .json({ message: 'Error deleting account', error: error.message });
 }
};
