import { NotificationType, Prisma } from '@prisma/client';
import {
  createCommentNotiDTO,
  createPriceNotiDTO,
  ReadMyNotificationDTO,
  UnreadNotiCountResponseDTO,
} from '../DTO/notificationsDTO';
import * as notiRepository from '../repositories/notificationsRepository';
import {
  Notification,
  PayloadForCommentNoti,
  PayloadForPriceNoti,
  UpdateNotificationInput,
} from '../typings/notificationTypes';
import * as likedProductsRepository from '../repositories/likedProductsRepository';
import { NotFoundError } from '../lib/errors/NotFoundError';
import { UnauthorizedError } from '../lib/errors/UnauthorizedError';
import { emitNotification } from '../websocket/emitters';

export const getMyNotifications = async (userId: number): Promise<Notification[]> => {
  return await notiRepository.findByUserId(userId);
};

export const getUnreadNotiCount = async (userId: number) => {
  const count = await notiRepository.countUnreadNoti(userId);
  return new UnreadNotiCountResponseDTO(count);
};

export const createCommentNotification = async (dto: createCommentNotiDTO) => {
  const { articleId, commentId, userId } = dto;
  const payload: PayloadForCommentNoti = { articleId, commentId };
  const type = NotificationType.COMMENT;
  await notiRepository.createCommentNoti({
    type,
    userId,
    payload,
  });
  emitNotification<PayloadForCommentNoti>(userId, payload);
};

export const createPriceNotifications = async (dto: createPriceNotiDTO) => {
  const { productId, afterPrice, beforePrice } = dto;
  const userIdTuples = await likedProductsRepository.getUserIdsByProductId(productId);
  const userIds = userIdTuples.map((u) => u.userId);
  const payload: PayloadForPriceNoti = { productId, beforePrice, afterPrice };
  await Promise.all(
    userIds.map(async (userId) => {
      const notification = await notiRepository.createPriceNoti({
        userId,
        type: NotificationType.PRICE,
        payload,
      });
      emitNotification<PayloadForPriceNoti>(userId, payload);
      return notification;
    }),
  );
};

export const readMyNotification = async (dto: ReadMyNotificationDTO): Promise<void> => {
  const { userId, notificationId } = dto;
  const notification = await notiRepository.findById(notificationId);
  if (!notification) {
    throw new NotFoundError(`Notification with id ${notificationId} does not exist.`);
  }
  if (notification.userId !== userId) {
    throw new UnauthorizedError(`No authorization`);
  }
  const input: UpdateNotificationInput = { id: notificationId, data: { isRead: true } };
  await notiRepository.update(input);
};
