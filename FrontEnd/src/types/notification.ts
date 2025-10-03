import type { IUploadedImage } from './posts'
import type { IUser } from './user'

export type NotificationType =
  | 'LIKE'
  | 'COMMENT'
  | 'TAG'
  | 'FOLLOW'
  | 'FOLLOW_REQUEST'
  | 'FOLLOW_ACCEPTED'

export interface Post {
  id: string
  caption: string
  onlyCloseFriends: boolean
  user: IUser
  images: IUploadedImage[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  parentId?: string
  createdAt: string
}

export interface INotification {
  id: string
  type: NotificationType
  actor: IUser
  receiver: IUser
  post?: Post
  comment?: Comment
  createdAt: string
  isRead: boolean
}

export interface IUnreadCountRes {
  success: boolean
  data: {
    unreadCount: number
  }
}

export interface INotificationRes {
  success: boolean
  data: Array<INotification>
}
