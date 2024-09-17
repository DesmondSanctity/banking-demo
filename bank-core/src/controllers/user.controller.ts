import { Request, Response } from 'express';
import * as userService from '../services/user.service.js';
import {
 RegisterUserRequest,
 LoginUserRequest,
 UpdateUserRequest,
 UserResponse,
 LoginResponse,
} from '../models/user.model.js';
import {
 registerUserSchema,
 loginUserSchema,
 updateUserSchema,
} from '../validations/user.js';

export const register = async (req: Request, res: Response) => {
 try {
  const validatedData = registerUserSchema.parse(req.body);
  const user: UserResponse = await userService.registerUser(
   validatedData as RegisterUserRequest
  );
  res.status(201).json({ message: 'User registered successfully', user });
 } catch (error) {
  console.log(error);
  res.status(400).json({ message: 'Error registering user', error });
 }
};

export const login = async (req: Request, res: Response) => {
 try {
  const validatedData = loginUserSchema.parse(req.body);
  const loginResponse: LoginResponse = await userService.loginUser(
   validatedData as LoginUserRequest
  );
  res.json({ message: 'Login successful', ...loginResponse });
 } catch (error) {
  res.status(401).json({ message: 'Invalid credentials', error });
 }
};

export const searchUser = async (req: Request, res: Response) => {
 try {
  const { accountNumber } = req.params;
  const name: string = await userService.searchUser(accountNumber);
  res.json({ name });
 } catch (error: any) {
  res.status(404).json({ message: 'Account not found', error: error.message });
 }
};

export const getAllUsers = async (req: Request, res: Response) => {
 try {
  const users: UserResponse[] = await userService.getAllUsers();
  res.json(users);
 } catch (error) {
  res.status(500).json({ message: 'Error fetching users', error });
 }
};

export const getUserById = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  const user: UserResponse | null = await userService.getUserById(id);
  if (user) {
   res.json(user);
  } else {
   res.status(404).json({ message: 'User not found' });
  }
 } catch (error: any) {
  res
   .status(500)
   .json({ message: 'Error fetching user', error: error.message });
 }
};

export const updateUser = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  const validatedData = updateUserSchema.parse(req.body);
  const updatedUser: UserResponse = await userService.updateUser(
   id,
   validatedData as UpdateUserRequest
  );
  res.json(updatedUser);
 } catch (error: any) {
  res
   .status(400)
   .json({ message: 'Error updating user', error: error.message });
 }
};

export const deleteUser = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  await userService.deleteUser(id);
  res.json({ message: 'User deleted successfully' });
 } catch (error: any) {
  res
   .status(500)
   .json({ message: 'Error deleting user', error: error.message });
 }
};
