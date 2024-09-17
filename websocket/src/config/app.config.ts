import dotenv from 'dotenv';

dotenv.config();

const port = process.env.APP_PORT_2 || 3001;
const jwtSecret = process.env.JWT_SECRET!;

export { port, jwtSecret};
