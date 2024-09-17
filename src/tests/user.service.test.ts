import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as userService from '../services/user.service.js';
import User from '../schemas/user.schema.js';
import Account from '../schemas/account.schema.js';
import { testDbURL } from '../config/app.config.js';

describe('User Service', () => {
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
  await Promise.all([User.deleteMany({}), Account.deleteMany({})]);
  await new Promise((resolve) => setTimeout(resolve, 100));
 });

 describe('registerUser', () => {
  it('should create a new user and an account', async () => {
   const userData = {
    name: 'Test User9',
    email: 'test9@example.com',
    password: 'password',
   };
   const result = await userService.registerUser(userData);
   expect(result).toHaveProperty('_id');
   expect(result.name).toBe(userData.name);
   expect(result.email).toBe(userData.email);
   const user = await User.findById(result._id).populate('accounts');
   expect(user!.accounts).toHaveLength(1);
  });

  it('should throw an error if email already exists', async () => {
   const userData = {
    name: 'Test User8',
    email: 'test8@example.com',
    password: 'password',
   };
   await userService.registerUser(userData);
   await expect(userService.registerUser(userData)).rejects.toThrow();
  });
 });

 describe('loginUser', () => {
 jest.setTimeout(30000);
  it('should return a token for valid credentials', async () => {
   const userData = {
    name: 'Test User10',
    email: 'test10@example.com',
    password: 'password',
   };
   await userService.registerUser(userData);
   const result = await userService.loginUser({
    email: userData.email,
    password: userData.password,
   });
   expect(result).toHaveProperty('token');
  });

  it('should throw an error for invalid credentials', async () => {
   const userData = {
    name: 'Test User11',
    email: 'test11@example.com',
    password: 'password',
   };
   await userService.registerUser(userData);
   await expect(
    userService.loginUser({ email: userData.email, password: 'wrongpassword' })
   ).rejects.toThrow('Invalid credentials');
  });
 });

 describe('searchUser', () => {
 jest.setTimeout(30000);
  it('should return user name for a given account number', async () => {
   const user = await User.create({
    name: 'Test User12',
    email: 'test12@example.com',
    password: 'password',
   });
   await Account.create({
    userId: user._id,
    accountNumber: '7969808901',
    balance: 1000,
    description: 'Test Account12',
   });

   const result = await userService.searchUser('7969808901');
   expect(result).toBe('Test User12');
  });

  it('should throw an error for non-existent account', async () => {
   await expect(userService.searchUser('9999999999')).rejects.toThrow(
    'Account not found'
   );
  });
 });

 describe('getAllUsers', () => {
 jest.setTimeout(30000);
  it('should return all users', async () => {
   await User.create({
    name: 'New User1',
    email: 'user1@example.com',
    password: 'password',
   });
   await User.create({
    name: 'New User2',
    email: 'user2@example.com',
    password: 'password',
   });

   const result = await userService.getAllUsers();
   expect(result).toHaveLength(2);
   expect(result[0]).toHaveProperty('name');
   expect(result[1]).toHaveProperty('name');
  });
 });

 describe('getUserById', () => {
 jest.setTimeout(30000);
  it('should return a user by id', async () => {
   const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
   });
   const result = await userService.getUserById(user._id.toString());
   expect(result).toHaveProperty('name', 'Test User');
  });

  it('should return null for non-existent user', async () => {
   const result = await userService.getUserById(
    new mongoose.Types.ObjectId().toString()
   );
   expect(result).toBeNull();
  });
 });

 describe('updateUser', () => {
 jest.setTimeout(30000);
  it('should update a user', async () => {
   const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
   });
   const result = await userService.updateUser(user._id.toString(), {
    name: 'Updated User',
   });
   expect(result.name).toBe('Updated User');
  });

  it('should throw an error for non-existent user', async () => {
   await expect(
    userService.updateUser(new mongoose.Types.ObjectId().toString(), {
     name: 'Updated User',
    })
   ).rejects.toThrow('User not found');
  });
 });

 describe('deleteUser', () => {
 jest.setTimeout(30000);
  it('should delete a user', async () => {
   const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
   });
   await userService.deleteUser(user._id.toString());
   const deletedUser = await User.findById(user._id);
   expect(deletedUser).toBeNull();
  });
 });
});
