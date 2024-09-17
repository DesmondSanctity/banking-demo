import mongoose, { Document } from 'mongoose';
import { UserResponse } from './user.model.js';

export interface CreateAccountRequest {
 userId: mongoose.Types.ObjectId;
 description: string;
}

export interface UpdateAccountRequest {
 description?: string;
}

export interface AccountResponse {
 _id: mongoose.Types.ObjectId;
 accountNumber: string;
 balance: number;
 description: string;
 user?: UserResponse;
 userId: mongoose.Types.ObjectId;
 transactions?: mongoose.Types.ObjectId[];
 createdAt: Date;
 updatedAt: Date;
}
