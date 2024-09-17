import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
 createAccount,
 deleteAccount,
 getAccountById,
 getAccounts,
 updateAccount,
} from '../controllers/account.controller.js';

const accountRoutes = express.Router();

accountRoutes.post('/', authenticate, createAccount);
accountRoutes.get('/', authenticate, getAccounts);
accountRoutes.get('/:id', authenticate, getAccountById);
accountRoutes.put('/:id', authenticate, updateAccount);
accountRoutes.delete('/:id', authenticate, deleteAccount);

export default accountRoutes;
