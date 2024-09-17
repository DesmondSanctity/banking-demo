import mongoose from 'mongoose';
import { generateAccountNumber } from '../utils/account.utils.js';
import {
 CreateAccountRequest,
 UpdateAccountRequest,
 AccountResponse,
} from '../models/account.model.js';
import Account from '../schemas/account.schema.js';

export const createAccount = async (
 data: CreateAccountRequest
): Promise<AccountResponse> => {
 const session = await mongoose.startSession();
 session.startTransaction();

 try {
  const userAccounts = await Account.countDocuments({
   userId: data.userId,
  }).session(session);

  if (userAccounts >= 4) {
   throw new Error('Maximum number of accounts reached');
  }

  const accountNumber = await generateAccountNumber();
  const account = await Account.create(
   [
    {
     accountNumber,
     balance: 5000,
     userId: data.userId,
    },
   ],
   { session }
  );

  await session.commitTransaction();
  session.endSession();

  return account[0].toObject();
 } catch (error) {
  await session.abortTransaction();
  session.endSession();
  throw error;
 }
};

export const getAccounts = async (
 userId: string
): Promise<AccountResponse[]> => {
 const accounts = await Account.find({ userId })
  .populate('user')
  .populate('transactions');
 return accounts.map((account) => account.toObject());
};

export const getAccountById = async (
 id: string
): Promise<AccountResponse | null> => {
 const account = await Account.findById(id)
  .populate('user')
  .populate('transactions');
 if (!account) return null;
 return account.toObject();
};

export const updateAccount = async (
 id: string,
 data: UpdateAccountRequest
): Promise<AccountResponse> => {
 const updatedAccount = await Account.findByIdAndUpdate(id, data, { new: true })
  .populate('user')
  .populate('transactions');
 if (!updatedAccount) throw new Error('Account not found');
 return updatedAccount.toObject();
};

export const deleteAccount = async (id: string): Promise<void> => {
 await Account.findByIdAndDelete(id);
};
