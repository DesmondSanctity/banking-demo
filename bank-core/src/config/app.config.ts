import dotenv from 'dotenv';

dotenv.config();

const port = process.env.APP_PORT_1 || 3000;
const jwtSecret = process.env.JWT_SECRET!;
const nodeEnv = process.env.NODE_ENV!;
const DbURL = process.env.DATABASE_URL!;
const testDbURL = process.env.MONGO_URL!;
const baseURL = process.env.BASE_URL!;

export { port, jwtSecret, nodeEnv, DbURL, testDbURL, baseURL };
