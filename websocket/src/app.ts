import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { setupWebSocket } from '../src/utils/websocket.utils.js';
import { port } from './config/app.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/websocket/errors', async (req, res) => {
 try {
  const errorFilePath = isProduction ? '/tmp/errors.txt' : path.join(__dirname, '..', '..', 'errors.txt');
  console.log(errorFilePath);
  const content = await fs.readFile(errorFilePath, 'utf-8');
  res.type('text/plain').send(content);
 } catch (error) {
  res.status(500).send({ 'Error reading error file': error });
 }
});

app.get('/api/websocket/interactions', async (req, res) => {
 try {
  const interactionFilePath = isProduction ? '/tmp/interactions.txt' : path.join(
   __dirname,
   '..',
   '..',
   'interactions.txt'
  );
  console.log(interactionFilePath);
  const content = await fs.readFile(interactionFilePath, 'utf-8');
  res.type('text/plain').send(content);
 } catch (error) {
  res.status(500).send('Error reading interaction file');
 }
});

setupWebSocket(wss);

server.listen(port, () => {
 console.log(`Server running on port ${port}`);
});

export default app;
