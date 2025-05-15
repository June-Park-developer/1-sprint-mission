import * as notiRepository from '../repositories/notificationsRepository';
import { NotificationType } from '../typings/notificationTypes';

export const getMyNotifications = async (userId: number): Promise<NotificationType[]> => {
  const notifications = await notiRepository.findByUserId(userId);
  return notifications;
};
