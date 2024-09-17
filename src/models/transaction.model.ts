import mongoose from 'mongoose';

export interface SendMoneyRequest {
 fromAccountId: string;
 toAccountNumber: string;
 amount: number;
}

export interface UpdateTransactionRequest {
 amount?: number;
 type?: string;
}

export interface TransactionResponse {
 _id: mongoose.Types.ObjectId;
 amount: number;
 type: string;
 fromAccountId: mongoose.Types.ObjectId;
 toAccountId: mongoose.Types.ObjectId;
 createdAt: Date;
}
