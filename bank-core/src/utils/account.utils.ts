import accountSchema from '../schemas/account.schema.js';

export const generateAccountNumber = async (): Promise<string> => {
 while (true) {
  const accountNumber = Math.floor(
   1000000000 + Math.random() * 9000000000
  ).toString();
  const existingAccount = await accountSchema.findOne({
   where: { accountNumber },
  });
  if (!existingAccount) {
   return accountNumber;
  }
 }
};
