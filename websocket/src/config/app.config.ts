import dotenv from 'dotenv';

dotenv.config();

const port = process.env.APP_PORT_2 || 3001;
const wsPort = process.env.WS_PORT || 8080;
const jwtSecret = process.env.JWT_SECRET!;

export { port, jwtSecret};
