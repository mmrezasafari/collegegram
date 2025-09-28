import { NotificationType } from "../notification-type.enum";

export interface Notification {
  id: string;
  receiverId: string;
  actorId: string;
  type: NotificationType; // Should ideally be NotificationType, but using string for simplicity
  isRead: boolean;
  postId?: string;
  commentId?: string;
}