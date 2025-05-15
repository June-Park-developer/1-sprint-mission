import { NotificationType, Prisma } from '@prisma/client';
//Entity

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  isRead: Boolean;
  payload: Prisma.JsonValue;
  createdAt: Date;
}

// Payload
export interface PayloadForCommentNoti {
  articleId: number;
  commentId: number;
}

export interface PayloadForPriceNoti {
  productId: number;
  beforePrice: number;
  afterPrice: number;
}

// Input
export interface createCommentNotiInput {
  payload: PayloadForCommentNoti;
  userId: number;
  type: NotificationType;
}

export interface createPriceNotiInput {
  payload: PayloadForPriceNoti;
  userId: number;
  type: NotificationType;
}
