import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../docs/index.js';
import userRoutes from './routes/user.routes.js';
import accountRoutes from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import { rateLimiter } from './middlewares/ratelimiter.js';
import { loggerMiddleware } from './middlewares/logger.js';
import db from './config/db.config.js';
import { port } from './config/app.config.js';
import './utils/websocket.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(rateLimiter);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(loggerMiddleware);

app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/websocket/errors', async (req, res) => {
 try {
  const errorFilePath = path.join(__dirname, '..', 'errors.txt');
  const content = await fs.readFile(errorFilePath, 'utf-8');
  res.type('text/plain').send(content);
 } catch (error) {
  res.status(500).send({ 'Error reading error file': error });
 }
});

app.get('/api/websocket/interactions', async (req, res) => {
 try {
  const interactionFilePath = path.join(__dirname, '..', 'interactions.txt');
  const content = await fs.readFile(interactionFilePath, 'utf-8');
  res.type('text/plain').send(content);
 } catch (error) {
  res.status(500).send('Error reading interaction file');
 }
});

// app.use(errorHandler);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, async () => {
 // Connect to MongoDB
 await db();
 console.log(`Server running on port ${port}`);
});

export default app;
