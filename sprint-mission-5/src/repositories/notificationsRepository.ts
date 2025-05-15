import { prismaClient } from '../lib/prismaClient';
import { NotificationType } from '../typings/notificationTypes';

export const findByUserId = async (userId: number): Promise<NotificationType[]> => {
  return await prismaClient.notification.findMany({ where: { userId } });
};
