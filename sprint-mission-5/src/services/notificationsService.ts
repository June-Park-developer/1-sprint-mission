import { NotificationType, Prisma } from '@prisma/client';
import { createCommentNotiDTO, UnreadNotiCountResponseDTO } from '../DTO/notificationsDTO';
import * as notiRepository from '../repositories/notificationsRepository';
import {
  Notification,
  PayloadForCommentNoti,
  PayloadForPriceNoti,
} from '../typings/notificationTypes';
import * as likedProductsRepository from '../repositories/likedProductsRepository';

export const getMyNotifications = async (userId: number): Promise<Notification[]> => {
  return await notiRepository.findByUserId(userId);
};

export const getUnreadNotiCount = async (userId: number) => {
  const count = await notiRepository.countUnreadNoti(userId);
  return new UnreadNotiCountResponseDTO(count);
};

export const createCommentNoti = async (dto: createCommentNotiDTO) => {
  const { articleId, commentId, userId } = dto;
  const payload: PayloadForCommentNoti = { articleId, commentId };
  const type = NotificationType.COMMENT;
  await notiRepository.createCommentNoti({
    type,
    userId,
    payload,
  });
};
