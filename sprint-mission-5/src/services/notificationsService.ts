import { UnreadNotiCountResponseDTO } from '../DTO/notificationsDTO';
import * as notiRepository from '../repositories/notificationsRepository';
import { NotificationType } from '../typings/notificationTypes';

export const getMyNotifications = async (userId: number): Promise<NotificationType[]> => {
  return await notiRepository.findByUserId(userId);
};

export const getUnreadNotiCount = async (userId: number) => {
  const count = await notiRepository.countUnreadNoti(userId);
  return new UnreadNotiCountResponseDTO(count);
};
