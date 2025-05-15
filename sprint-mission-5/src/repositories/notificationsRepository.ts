import { prismaClient } from '../lib/prismaClient';
import { NotificationType } from '../typings/notificationTypes';

export const findByUserId = async (userId: number): Promise<NotificationType[]> => {
  return await prismaClient.notification.findMany({ where: { userId } });
};

export const countUnreadNoti = async (userId: number): Promise<number> => {
  return await prismaClient.notification.count({ where: { userId, isRead: false } });
};
