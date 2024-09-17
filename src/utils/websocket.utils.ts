import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import { WebSocketServer, WebSocket } from 'ws';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { jwtSecret } from '../config/app.config.js';

const server = createServer();
const wss = new WebSocketServer({ server });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errorFilePath = path.join(__dirname, '..', '..', 'errors.txt');
const interactionFilePath = path.join(
 __dirname,
 '..',
 '..',
 'interactions.txt'
);

wss.on('connection', (ws: WebSocket) => {
 ws.on('message', async (message: string) => {
  const data = JSON.parse(message);
  if (data.type === 'auth') {
   try {
    const decoded = jwt.verify(data.token, jwtSecret!);
    (ws as any).userId = (decoded as any).userId;
    ws.send(JSON.stringify({ type: 'auth', status: 'success' }));
   } catch (error) {
    ws.send(JSON.stringify({ type: 'auth', status: 'error' }));
   }
  } else if (data.type === 'event.error') {
   console.log(data.data);
   await fs.appendFile(errorFilePath, `${data.data}\n`);
  } else if (data.type === 'event.interaction') {
   console.log(data.data);
   await fs.appendFile(interactionFilePath, `${data.data}\n`);
  }
 });
});

export const notifyUser = (userId: string, data: any) => {
 wss.clients.forEach((client) => {
  if ((client as any).userId === userId) {
   client.send(JSON.stringify(data));
  }
 });
};

const PORT = process.env.WS_PORT || 8080;
server.listen(PORT, () => {
 console.log(`WebSocket server is running on port ${PORT}`);
});
