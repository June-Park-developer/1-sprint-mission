import { PayloadForCommentNoti, PayloadForPriceNoti } from '../typings/notificationTypes';
import { getIo } from './setupWebSocket';

const io = getIo();

export const emitNotification = <T>(userId: number, payload: T) => {
  try {
    io.to(`${userId}`).emit('notification', payload);
  } catch (error) {
    console.error(`Failed to emit notification for user ${userId}:`, error);
  }
};
