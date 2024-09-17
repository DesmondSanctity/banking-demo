import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
 sendMoney,
 getTransactionHistory,
 getAllTransactions,
 getTransactionById,
 updateTransaction,
 deleteTransaction,
} from '../controllers/transaction.controller.js';

const transactionRoutes = express.Router();

transactionRoutes.post('/send', authenticate, sendMoney);
transactionRoutes.get(
 '/history/:accountId',
 authenticate,
 getTransactionHistory
);
transactionRoutes.get('/', authenticate, getAllTransactions);
transactionRoutes.get('/:id', authenticate, getTransactionById);
transactionRoutes.put('/:id', authenticate, updateTransaction);
transactionRoutes.delete('/:id', authenticate, deleteTransaction);

export default transactionRoutes;
