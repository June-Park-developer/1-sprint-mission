import { Request, Response } from 'express';
import * as notiService from '../services/notificationsService';
import { UnreadNotiCountResponseDTO } from '../DTO/notificationsDTO';

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
