import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
 {
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 5000 },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
 },
 { timestamps: true }
);

export default mongoose.model('Account', accountSchema);
