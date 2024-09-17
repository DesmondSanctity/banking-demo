import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../docs/index.js';
import userRoutes from './routes/user.routes.js';
import accountRoutes from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import { rateLimiter } from './middlewares/ratelimiter.js';
import {
 errorLoggerMiddleware,
 loggerMiddleware,
} from './middlewares/logger.js';
import db from './config/db.config.js';
import { port } from './config/app.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
 cors({
  origin: ['http://localhost:3001', 'https://websocket.onrender.com'],
 })
);

app.use(express.json());
app.use(rateLimiter);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(loggerMiddleware);

app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(errorLoggerMiddleware);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, async () => {
 // Connect to MongoDB
 await db();
 console.log(`Server running on port ${port}`);
});

export default app;
