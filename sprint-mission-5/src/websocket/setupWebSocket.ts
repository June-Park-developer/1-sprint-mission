import { Server, Socket } from 'socket.io';
import http from 'http';
import { UnauthorizedError } from '../lib/errors/UnauthorizedError';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/constants';

let io: Server | null = null;
export function setupWebSocket(server: http.Server) {
  io = new Server(server, {
    path: '/',
    cors: {
      origin: '*',
    },
  });

  // Todo: 인증 함수 따로 빼기...!!!!
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new UnauthorizedError('Not Authorized'));
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET as jwt.Secret) as { userId: number }; // ?: 찝찝..
      const userId = payload.userId as number;
      socket.user = { userId };
      next();
    } catch (error) {
      next(new UnauthorizedError('Not Authorized'));
    }
  });
  console.log('socket.IO is listening on path: /');

  io.on('connection', (socket) => {
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
