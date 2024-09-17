import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
 register,
 login,
 searchUser,
 deleteUser,
 getAllUsers,
 getUserById,
 updateUser,
} from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.post('/signup', register);
userRoutes.post('/login', login);
userRoutes.get('/search/:accountNumber', authenticate, searchUser);
userRoutes.get('/', authenticate, getAllUsers);
userRoutes.get('/:id', authenticate, getUserById);
userRoutes.put('/:id', authenticate, updateUser);
userRoutes.delete('/:id', authenticate, deleteUser);

export default userRoutes;
