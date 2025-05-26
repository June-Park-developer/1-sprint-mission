import { Socket } from 'socket.io';
import { UnauthorizedError } from '../lib/errors/UnauthorizedError';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/constants';

// 미들웨어처럼 따로 뺐습니다!
export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.accessToken;
  if (!token) {
    console.log('토큰이 없어용 - 소켓');
    return next(new UnauthorizedError('Not Authorized'));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET as jwt.Secret) as { userId: number }; // ?: 찝찝..
    const userId = payload.userId as number;
    socket.user = { userId };
    next();
  } catch (error) {
    console.log('인증 오류');
    next(new UnauthorizedError('Not Authorized'));
  }
};
