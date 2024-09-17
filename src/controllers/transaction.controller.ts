import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service.js';
import {
 SendMoneyRequest,
 UpdateTransactionRequest,
 TransactionResponse,
} from '../models/transaction.model.js';
import {
 sendMoneySchema,
 updateTransactionSchema,
} from '../validations/transaction.js';

export const sendMoney = async (req: Request, res: Response) => {
 try {
  const validatedData = sendMoneySchema.parse(req.body);
  const transaction: TransactionResponse = await transactionService.sendMoney(
   validatedData as SendMoneyRequest
  );
  res.json({ message: 'Transaction successful', transaction });
 } catch (error: any) {
  res
   .status(400)
   .json({ message: 'Error processing transaction', error: error.message });
 }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
 try {
  const { accountId } = req.params;
  const transactions: TransactionResponse[] =
   await transactionService.getTransactionHistory(accountId);
  res.json(transactions);
 } catch (error: any) {
  res.status(500).json({
   message: 'Error fetching transaction history',
   error: error.message,
  });
 }
};

export const getAllTransactions = async (req: Request, res: Response) => {
 try {
  const transactions: TransactionResponse[] =
   await transactionService.getAllTransactions();
  res.json(transactions);
 } catch (error: any) {
  res
   .status(500)
   .json({ message: 'Error fetching transactions', error: error.message });
 }
};

export const getTransactionById = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  const transaction: TransactionResponse | null =
   await transactionService.getTransactionById(id);
  if (transaction) {
   res.json(transaction);
  } else {
   res.status(404).json({ message: 'Transaction not found' });
  }
 } catch (error: any) {
  res
   .status(500)
   .json({ message: 'Error fetching transaction', error: error.message });
 }
};

export const updateTransaction = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  const validatedData = updateTransactionSchema.parse(req.body);
  const updatedTransaction: TransactionResponse =
   await transactionService.updateTransaction(
    id,
    validatedData as UpdateTransactionRequest
   );
  res.json(updatedTransaction);
 } catch (error: any) {
  res
   .status(400)
   .json({ message: 'Error updating transaction', error: error.message });
 }
};

export const deleteTransaction = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  await transactionService.deleteTransaction(id);
  res.json({ message: 'Transaction deleted successfully' });
 } catch (error: any) {
  res
   .status(500)
   .json({ message: 'Error deleting transaction', error: error.message });
 }
};
