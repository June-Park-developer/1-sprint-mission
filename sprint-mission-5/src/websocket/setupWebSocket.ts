import { Server, Socket } from 'socket.io';
import http from 'http';
import { authenticateSocket } from './authenticateSocket';

let io: Server | null = null;
export function setupWebSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.use(authenticateSocket);
  console.log('socket.IO is listening');

  io.on('connection', (socket: Socket) => {
    console.log('Client connected');
    const userId = socket.user!.userId;
    socket.join(`${userId}`);
  });

  return io;
}

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};
