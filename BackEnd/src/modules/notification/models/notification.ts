import { Comment } from "../../comment/model/comment";
import { Post } from "../../post/model/post";
import { User } from "../../user/model/user";
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

export interface NotificationDetails {
  id: string;
  type: NotificationType;
  actor: User;
  receiver?: User | null;
  post?: Post | null;
  comment?: Comment | null;
  isRead?: boolean;
  createdAt: Date;
}
