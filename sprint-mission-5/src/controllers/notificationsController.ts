import { Request, Response } from 'express';
import * as notiService from '../services/notificationsService';
import { UnreadNotiCountResponseDTO } from '../DTO/notificationsDTO';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';

export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const notifications = await notiService.getMyNotifications(userId);
  res.status(200).json(notifications);
};

export const getUnreadNotiCount = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const unreadCount: UnreadNotiCountResponseDTO = await notiService.getUnreadNotiCount(userId);
  res.status(200).json(unreadCount);
};

export const readMyNotification = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const { id: notificationId } = create(req.params, IdParamsStruct);
  await notiService.readMyNotification({ userId, notificationId });
  res.status(200).json({ message: 'Marked as read' });
};
