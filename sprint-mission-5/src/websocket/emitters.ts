import { getIo } from './setupWebSocket';

export const emitNotification = <T>(userId: number, payload: T) => {
  try {
    const io = getIo();
    io.to(`${userId}`).emit('notification', payload);
    console.log('notification 전송 완료');
  } catch (error) {
    console.error(`Failed to emit notification for user ${userId}:`, error);
  }
};
