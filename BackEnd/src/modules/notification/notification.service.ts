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
}