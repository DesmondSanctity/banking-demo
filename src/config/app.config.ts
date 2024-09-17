import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;
const nodeEnv = process.env.NODE_ENV;

export { port, jwtSecret, nodeEnv };
