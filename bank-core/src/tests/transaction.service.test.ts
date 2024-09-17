import mongoose from 'mongoose';
import * as transactionService from '../services/transaction.service.js';
import Account from '../schemas/account.schema.js';
import Transaction from '../schemas/transaction.schema.js';
import { testDbURL } from '../config/app.config.js';

describe('Transaction Service', () => {
 beforeAll(async () => {
  if (testDbURL) {
   await mongoose.connect(testDbURL);
  } else {
   throw new Error('testDbURL is undefined');
  }
 });

 afterAll(async () => {
  await mongoose.connection.close();
 });

 beforeEach(async () => {
  await Account.deleteMany({});
  await Transaction.deleteMany({});
 });

 describe('sendMoney', () => {
  jest.setTimeout(30000);
  it('should create a new transaction and update account balances', async () => {
   const fromAccount = await Account.create({
    accountNumber: '4567890032',
    balance: 1000,
    description: 'Test Account7',
    userId: new mongoose.Types.ObjectId(),
   });
   const toAccount = await Account.create({
    accountNumber: '5949293431',
    balance: 500,
    description: 'Test Account8',
    userId: new mongoose.Types.ObjectId(),
   });
   const transactionData = {
    fromAccountId: fromAccount._id.toString(),
    toAccountNumber: toAccount.accountNumber,
    amount: 200,
    type: 'transfer',
   };

   const result = await transactionService.sendMoney(transactionData);
   expect(result).toHaveProperty('_id');
   expect(result.amount).toBe(200);

   const updatedFromAccount = await Account.findById(result.fromAccountId);
   const updatedToAccount = await Account.findById(result.toAccountId);

   expect(updatedFromAccount!.balance).toBe(800);
   expect(updatedToAccount!.balance).toBe(700);
  });

  it('should throw an error if sender has insufficient funds', async () => {
   const fromAccount = await Account.create({
    accountNumber: '2309458761',
    balance: 100,
    description: 'New Account',
    userId: new mongoose.Types.ObjectId(),
   });
   const toAccount = await Account.create({
    accountNumber: '1023459876',
    balance: 500,
    description: 'New Account',
    userId: new mongoose.Types.ObjectId(),
   });
   const transactionData = {
    fromAccountId: fromAccount._id.toString(),
    toAccountNumber: toAccount.accountNumber,
    amount: 200,
   };
   await expect(transactionService.sendMoney(transactionData)).rejects.toThrow(
    'Insufficient funds'
   );
  });
 });

 describe('getTransactionHistory', () => {
  jest.setTimeout(30000);
  it('should return transaction history for an account', async () => {
   const account = await Account.create({
    accountNumber: '1122998877',
    balance: 1000,
    description: 'New Account',
    userId: new mongoose.Types.ObjectId(),
   });
   await Transaction.create({
    fromAccountId: account._id,
    toAccountId: new mongoose.Types.ObjectId(),
    amount: 100,
    type: 'transfer',
   });
   await Transaction.create({
    fromAccountId: new mongoose.Types.ObjectId(),
    toAccountId: account._id,
    amount: 200,
    type: 'transfer',
   });

   const result = await transactionService.getTransactionHistory(
    account._id.toString()
   );
   expect(result).toHaveLength(2);
   expect(result[0]).toHaveProperty('amount');
   expect(result[1]).toHaveProperty('amount');
  });
 });

 describe('getAllTransactions', () => {
  jest.setTimeout(30000);
  it('should return all transactions', async () => {
   await Transaction.create({
    fromAccountId: new mongoose.Types.ObjectId(),
    toAccountId: new mongoose.Types.ObjectId(),
    amount: 100,
    type: 'transfer',
   });
   await Transaction.create({
    fromAccountId: new mongoose.Types.ObjectId(),
    toAccountId: new mongoose.Types.ObjectId(),
    amount: 200,
    type: 'transfer',
   });

   const result = await transactionService.getAllTransactions();
   expect(result).toHaveLength(2);
  });
 });

 describe('getTransactionById', () => {
  jest.setTimeout(30000);
  it('should return a transaction by id', async () => {
   const transaction = await Transaction.create({
    fromAccountId: new mongoose.Types.ObjectId(),
    toAccountId: new mongoose.Types.ObjectId(),
    amount: 100,
    type: 'transfer',
   });
   const result = await transactionService.getTransactionById(
    transaction._id.toString()
   );
   expect(result).toHaveProperty('amount', 100);
  });

  it('should return null for non-existent transaction', async () => {
   const result = await transactionService.getTransactionById(
    new mongoose.Types.ObjectId().toString()
   );
   expect(result).toBeNull();
  });
 });

 describe('deleteTransaction', () => {
  jest.setTimeout(30000);
  it('should delete a transaction', async () => {
   const transaction = await Transaction.create({
    fromAccountId: new mongoose.Types.ObjectId(),
    toAccountId: new mongoose.Types.ObjectId(),
    amount: 100,
    type: 'transfer',
   });

   await transactionService.deleteTransaction(transaction._id.toString());

   const deletedTransaction = await Transaction.findById(transaction._id);
   expect(deletedTransaction).toBeNull();
  });
 });
});
