import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAccountNumber } from '../utils/account.utils.js';
import {
 RegisterUserRequest,
 LoginUserRequest,
 UpdateUserRequest,
 UserResponse,
 LoginResponse,
 SearchUser,
} from '../models/user.model.js';
import { AccountResponse } from '../models/account.model.js';
import User from '../schemas/user.schema.js';
import Account from '../schemas/account.schema.js';
import { jwtSecret } from '../config/app.config.js';

export const registerUser = async (
 data: RegisterUserRequest
): Promise<UserResponse> => {
 const session = await mongoose.startSession();
 session.startTransaction();

 try {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const accountNumber = await generateAccountNumber();

  const user = await User.create(
   [
    {
     name: data.name,
     email: data.email,
     password: hashedPassword,
    },
   ],
   { session }
  );

  await Account.create(
   [
    {
     accountNumber,
     balance: 5000,
     userId: user[0]._id,
    },
   ],
   { session }
  );

  await session.commitTransaction();
  return user[0].toObject();
 } catch (error) {
  await session.abortTransaction();
  throw error;
 } finally {
  session.endSession();
 }
};

export const loginUser = async (
 data: LoginUserRequest
): Promise<LoginResponse> => {
 const user = await User.findOne({ email: data.email });

 if (!user || !(await bcrypt.compare(data.password, user.password))) {
  throw new Error('Invalid credentials');
 }

 const token = jwt.sign({ userId: user._id }, jwtSecret!, {
  expiresIn: '1h',
 });
 return { token };
};

export const searchUser = async (accountNumber: string): Promise<string> => {
 const account = await Account.findOne({
  accountNumber,
 }).populate<SearchUser>('userId', 'name');

 if (!account) {
  throw new Error('Account not found');
 }

 return account.userId.name;
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
 const users = await User.find().populate('accounts');
 return users.map((user) => user.toObject());
};

export const getUserById = async (id: string): Promise<UserResponse | null> => {
 const user = await User.findById(id).populate('accounts');
 return user ? user.toObject() : null;
};

export const updateUser = async (
 id: string,
 data: UpdateUserRequest
): Promise<UserResponse> => {
 const updatedUser = await User.findByIdAndUpdate(id, data, {
  new: true,
 }).populate('accounts');
 if (!updatedUser) throw new Error('User not found');
 return updatedUser.toObject();
};

export const deleteUser = async (id: string): Promise<void> => {
 await User.findByIdAndDelete(id);
};
