import mongoose from "mongoose";

export interface RegisterUserRequest {
 name: string;
 email: string;
 password: string;
}

export interface LoginUserRequest {
 email: string;
 password: string;
}

export interface UpdateUserRequest {
 name?: string;
 email?: string;
 password?: string;
}

export interface UserResponse {
 _id: mongoose.Types.ObjectId;
 name: string;
 email: string;
 accounts?: mongoose.Types.ObjectId[];
 createdAt: Date;
 updatedAt: Date;
}

export interface LoginResponse {
 token: string;
}

export interface SearchUser extends mongoose.Document {
 userId: {
  _id: mongoose.Types.ObjectId;
  name: string;
 };
}