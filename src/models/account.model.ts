import mongoose from 'mongoose';
import Account from '../schemas/account.schema.js';
import { TransactionResponse } from './transaction.model.js';
import { UserResponse } from './user.model.js';

export interface CreateAccountRequest {
 userId: string;
}

export interface UpdateAccountRequest {
 balance?: number;
}

export interface AccountResponse {
 _id: mongoose.Types.ObjectId;
 accountNumber: string;
 balance: number;
 user?: UserResponse;
 userId: mongoose.Types.ObjectId;
 transactions?: mongoose.Types.ObjectId[];
 createdAt: Date;
 updatedAt: Date;
}
