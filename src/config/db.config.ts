import mongoose from 'mongoose';
import { DbURL } from './app.config.js';

const db = async () => {
 try {
  await mongoose.connect(DbURL);
  console.log('MongoDB connected successfully');
 } catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
 }
};

export default db;
