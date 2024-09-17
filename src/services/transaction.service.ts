import mongoose from 'mongoose';
import {
 SendMoneyRequest,
 UpdateTransactionRequest,
 TransactionResponse,
} from '../models/transaction.model.js';
import Account from '../schemas/account.schema.js';
import Transaction from '../schemas/transaction.schema.js';

export const sendMoney = async (
 data: SendMoneyRequest
): Promise<TransactionResponse> => {
 const session = await mongoose.startSession();
 session.startTransaction();

 try {
  const fromAccount = await Account.findById(data.fromAccountId).session(
   session
  );
  const toAccount = await Account.findOne({
   accountNumber: data.toAccountNumber,
  }).session(session);

  if (!fromAccount || !toAccount) {
   throw new Error('Invalid account');
  }

  if (fromAccount.balance < data.amount) {
   throw new Error('Insufficient funds');
  }

  fromAccount.balance -= data.amount;
  toAccount.balance += data.amount;

  await fromAccount.save({ session });
  await toAccount.save({ session });

  const transaction = await Transaction.create(
   [
    {
     amount: data.amount,
     type: 'transfer',
     fromAccountId: data.fromAccountId,
     toAccountId: toAccount._id,
    },
   ],
   { session }
  );

  const newTransaction = await Transaction.findOne({
   _id: transaction[0]._id,
  })
   .populate('fromAccountId toAccountId')
   .session(session);

  await session.commitTransaction();

  if (!newTransaction) {
   throw new Error('Transaction not found');
  }

  return newTransaction.toObject() as TransactionResponse;
 } catch (error) {
  await session.abortTransaction();
  throw error;
 } finally {
  session.endSession();
 }
};

export const getTransactionHistory = async (
 accountId: string
): Promise<TransactionResponse[]> => {
 const transactions = await Transaction.find({
  $or: [{ fromAccountId: accountId }, { toAccountId: accountId }],
 }).sort({ createdAt: -1 });

 return transactions.map((t) => t.toObject());
};

export const getAllTransactions = async (): Promise<TransactionResponse[]> => {
 const transactions = await Transaction.find();
 return transactions.map((t) => t.toObject());
};

export const getTransactionById = async (
 id: string
): Promise<TransactionResponse | null> => {
 const transaction = await Transaction.findById(id);
 return transaction ? transaction.toObject() : null;
};

export const updateTransaction = async (
 id: string,
 data: UpdateTransactionRequest
): Promise<TransactionResponse> => {
 const updatedTransaction = await Transaction.findByIdAndUpdate(id, data, {
  new: true,
 });
 if (!updatedTransaction) throw new Error('Transaction not found');
 return updatedTransaction.toObject();
};

export const deleteTransaction = async (id: string): Promise<void> => {
 await Transaction.findByIdAndDelete(id);
};
