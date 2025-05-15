import { Prisma } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { createCommentNotiInput, Notification } from '../typings/notificationTypes';

export const findByUserId = async (userId: number): Promise<Notification[]> => {
  return await prismaClient.notification.findMany({ where: { userId } });
};

export const countUnreadNoti = async (userId: number): Promise<number> => {
  return await prismaClient.notification.count({ where: { userId, isRead: false } });
};

export const createCommentNoti = async (input: createCommentNotiInput) => {
  const { userId, type, payload } = input;
  const jsonPayload: Prisma.InputJsonValue = { ...payload };
  return await prismaClient.notification.create({ data: { userId, type, payload: jsonPayload } });
};
