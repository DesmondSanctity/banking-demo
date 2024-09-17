import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import userRoutes from './routes/user.routes.js';
import accountRoutes from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import { errorHandler } from './middlewares/reponse.js';
import { rateLimiter } from './middlewares/ratelimiter.js';
import { loggerMiddleware } from './middlewares/logger.js';
import db from './config/db.config.js';
import { port } from './config/app.config.js';
import './utils/websocket.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
db()
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

app.use(express.json());
app.use(rateLimiter);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(loggerMiddleware);

app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

// app.use(errorHandler);

app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});

export default app;
