import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
      auth?: { userId: number };
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: { userId: number };
  }
}
