import { Prisma } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import {
  createCommentNotiInput,
  createPriceNotiInput,
  Notification,
  UpdateNotificationInput,
} from '../typings/notificationTypes';

export const findByUserId = async (userId: number): Promise<Notification[]> => {
  return await prismaClient.notification.findMany({ where: { userId } });
};

export const findById = async (id: number): Promise<Notification | null> => {
  return await prismaClient.notification.findUnique({ where: { id } });
};

export const countUnreadNoti = async (userId: number): Promise<number> => {
  return await prismaClient.notification.count({ where: { userId, isRead: false } });
};

export const createCommentNoti = async (input: createCommentNotiInput) => {
  const { userId, type, payload } = input;
  const jsonPayload: Prisma.InputJsonValue = { ...payload };
  return await prismaClient.notification.create({ data: { userId, type, payload: jsonPayload } });
};

export const createPriceNoti = async (input: createPriceNotiInput) => {
  const { userId, type, payload } = input;
  const jsonPayload: Prisma.InputJsonValue = { ...payload };
  return await prismaClient.notification.create({ data: { userId, type, payload: jsonPayload } });
};

export const update = async (input: UpdateNotificationInput): Promise<void> => {
  const { id, data } = input;
  await prismaClient.notification.update({ where: { id }, data });
};
