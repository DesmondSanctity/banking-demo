import mongoose from 'mongoose';
import * as accountService from '../services/account.service.js';
import Account from '../schemas/account.schema.js';
import User from '../schemas/user.schema.js';
import { testDbURL } from '../config/app.config.js';

describe('Account Service', () => {
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
  await User.deleteMany({});
 });

 describe('createAccount', () => {
  jest.setTimeout(15000);
  it('should create a new account', async () => {
   const user = await User.create({
    name: 'Test User1',
    email: 'test1@example.com',
    password: 'password',
   });
   const accountData = { userId: user._id, description: 'Test Account' };
   const result = await accountService.createAccount(accountData);
   expect(result).toHaveProperty('accountNumber');
   expect(result.userId.toString()).toBe(user._id.toString());
  });

  it('should throw an error if user has reached maximum accounts', async () => {
   const user = await User.create({
    name: 'Test User2',
    email: 'test2@example.com',
    password: 'password',
   });
   const accountData = { userId: user._id, description: 'Test Account' };
   for (let i = 0; i < 4; i++) {
    await accountService.createAccount(accountData);
   }
   await expect(accountService.createAccount(accountData)).rejects.toThrow(
    'Maximum number of accounts reached'
   );
  });
 });

 describe('getAccounts', () => {
  jest.setTimeout(10000);
  it('should return all accounts for a user', async () => {
   const user = await User.create({
    name: 'Test User3',
    email: 'test3@example.com',
    password: 'password',
   });
   await Account.create({
    userId: user._id,
    accountNumber: '5746363636',
    balance: 1000,
    description: 'Test Account1',
   });
   await Account.create({
    userId: user._id,
    accountNumber: '9696382615',
    balance: 2000,
    description: 'Test Account2',
   });

   const result = await accountService.getAccounts(user._id);// Debug log
   expect(result).toHaveLength(2);
   expect(result[0]).toHaveProperty('accountNumber', '5746363636');
   expect(result[1]).toHaveProperty('accountNumber', '9696382615');
  });
 });

 describe('getAccountById', () => {
  jest.setTimeout(30000);
  it('should return an account by id', async () => {
   const user = await User.create({
    name: 'Test User4',
    email: 'test4@example.com',
    password: 'password',
   });
   const account = await Account.create({
    userId: user._id,
    accountNumber: '1010102828',
    balance: 1000,
    description: 'Test Account3',
   });
   const result = await accountService.getAccountById(account._id.toString());
   expect(result).toHaveProperty('accountNumber', '1010102828');
   expect(result?.balance).toBe(1000);
  });

  it('should return null for non-existent account', async () => {
   const result = await accountService.getAccountById(
    new mongoose.Types.ObjectId().toString()
   );
   expect(result).toBeNull();
  });
 });

 describe('updateAccount', () => {
  jest.setTimeout(30000);
  it('should update an account', async () => {
   const user = await User.create({
    name: 'Test User5',
    email: 'test5@example.com',
    password: 'password',
   });
   const account = await Account.create({
    userId: user._id,
    accountNumber: '4499330000',
    balance: 1000,
    description: 'Test Account4',
   });
   const result = await accountService.updateAccount(account._id.toString(), {
    description: 'Salary Account',
   });
   expect(result.description).toBe('Salary Account');
  });

  it('should throw an error for non-existent account', async () => {
   await expect(
    accountService.updateAccount(new mongoose.Types.ObjectId().toString(), {
     description: 'Salary Account',
    })
   ).rejects.toThrow('Account not found');
  });
 });

 describe('deleteAccount', () => {
  jest.setTimeout(30000);
  it('should delete an account and remove it from user', async () => {
   const user = await User.create({
    name: 'Test User6',
    email: 'test6@example.com',
    password: 'password',
   });
   const account = await Account.create({
    userId: user._id,
    accountNumber: '2299008877',
    balance: 1000,
    description: 'Test Account5',
   });
   await User.findByIdAndUpdate(user._id, { $push: { accounts: account._id } });

   await accountService.deleteAccount(account._id.toString());

   const deletedAccount = await Account.findById(account._id);
   expect(deletedAccount).toBeNull();

   const updatedUser = await User.findById(user._id);
   expect(updatedUser?.accounts).not.toContain(account._id);
  });
 });
});
