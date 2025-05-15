import { NotificationType } from '../typings/notificationTypes';

// Response
export type NotiListResponseDTO = NotificationType[];

export class UnreadNotiCountResponseDTO {
  unreadCount: number;
  // 정은 Todo : 뭐가 들어가는지 타입 지정하고 constructor 완성하기
  constructor(count: number) {
    this.unreadCount = count;
  }
}
