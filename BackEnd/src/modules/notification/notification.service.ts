import { HttpError } from "../../../utility/http-error";
import { NotificationType } from "./notification-type.enum";
import { INotificationRepository } from "./notification.repository";


export class NotificationService {
    constructor(
        private notificationRepo: INotificationRepository,
    ) { }

    async createNotification(
        receiverId: string,
        actorId: string,
        type: NotificationType,
        postId?: string,
        commentId?: string
    ) {
        const notification = await this.notificationRepo.createNotification(
            receiverId,
            actorId,
            type,
            postId,
            commentId
        );

        if (!notification) {
            throw new HttpError(500, "خطا در ساخت نوتیفیکیشن");
        }
        return notification;
    }

    async deleteNotification(id: string) {
        await this.notificationRepo.deleteNotification(id);
    }

    async deleteNotifications(actorId:string, receiversId:string[], type: NotificationType, postId:string){ 
        await this.notificationRepo.deleteNotifications(actorId, receiversId, type, postId)

    }

    async getNotification(
        receiverId: string,
        actorId: string,
        type: NotificationType,
        postId?: string,
        commentId?: string
    ) {
        const notification = await this.notificationRepo.getNotification(type, receiverId, actorId, postId, commentId);
        if (!notification) {
            throw new HttpError(404, "اطلاعیه درخواست دنبال کردن یافت نشد")
        }
        return notification
    }

    async getMyNotifications(userId: string, offset: number, limit: number) {
        return await this.notificationRepo.getMyNotifications(userId, offset, limit);
    }

    async getFriendsNotifications(userId: string, friendsId: string[], offset: number, limit: number) {
        return await this.notificationRepo.getFriendsNotifications(userId, friendsId, offset, limit);
    }

    async getUnreadCount(userId: string) {
        const unreadCount = await this.notificationRepo.getUnreadCount(userId);
        return { unreadCount };
    }

    async markAsRead(notificationIds: string[]) {
        return await this.notificationRepo.markAsRead(notificationIds)
    }

    async deleteBlockUserNotifications(actorId:string, receiverId:string){ 
        await this.notificationRepo.deleteBlockUserNotificatios(actorId, receiverId)

    }
}