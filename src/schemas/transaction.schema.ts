import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
 {
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  fromAccountId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Account',
   required: true,
  },
  toAccountId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Account',
   required: true,
  },
 },
 { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
