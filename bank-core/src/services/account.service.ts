import mongoose from 'mongoose';
import { generateAccountNumber } from '../utils/account.utils.js';
import {
 CreateAccountRequest,
 UpdateAccountRequest,
 AccountResponse,
} from '../models/account.model.js';
import Account from '../schemas/account.schema.js';
import User from '../schemas/user.schema.js';

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
     description: data.description,
    },
   ],
   { session }
  );

  // Add the created account to the user's accounts array
  await User.findByIdAndUpdate(
   data.userId,
   { $push: { accounts: account[0]._id } },
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
 userId: mongoose.Types.ObjectId
): Promise<AccountResponse[]> => {
 const accounts = await Account.find({ userId }).populate({
  path: 'userId',
  select: '-accounts',
 });
 return accounts.map((account) => account.toObject());
};

export const getAccountById = async (
 id: string
): Promise<AccountResponse | null> => {
 const account = await Account.findById(id)
  .populate({
   path: 'userId',
   select: '-accounts',
  })
  .populate('transactions');
 if (!account) return null;
 return account.toObject();
};

export const updateAccount = async (
 id: string,
 data: UpdateAccountRequest
): Promise<AccountResponse> => {
 const updatedAccount = await Account.findByIdAndUpdate(id, data, {
  new: true,
 });
 if (!updatedAccount) throw new Error('Account not found');
 return updatedAccount.toObject();
};

export const deleteAccount = async (id: string): Promise<void> => {
 const session = await mongoose.startSession();
 session.startTransaction();

 try {
  const account = await Account.findById(id).session(session);
  if (!account) {
   throw new Error('Account not found');
  }

  await Account.findByIdAndDelete(id).session(session);
  await User.findByIdAndUpdate(account.userId, {
   $pull: { accounts: id },
  }).session(session);

  await session.commitTransaction();
 } catch (error) {
  await session.abortTransaction();
  throw error;
 } finally {
  session.endSession();
 }
};
