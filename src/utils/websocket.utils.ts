import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { jwtSecret } from '../config/app.config.js';

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
 ws.on('message', (message: string) => {
  const data = JSON.parse(message);
  if (data.type === 'auth') {
   try {
    const decoded = jwt.verify(data.token, jwtSecret!);
    (ws as any).userId = (decoded as any).userId;
    ws.send(JSON.stringify({ type: 'auth', status: 'success' }));
   } catch (error) {
    ws.send(JSON.stringify({ type: 'auth', status: 'error' }));
   }
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
