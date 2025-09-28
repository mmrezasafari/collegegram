import { DataSource, Repository } from "typeorm";
import { NotificationEntity } from "./notification.entity";
import { NotificationType } from "./notification-type.enum";
import { Notification } from "./models/notification";


export interface INotificationRepository {
    createNotification(receiverId: string, actorId: string, type: NotificationType, postId?: string, commentId?: string): Promise<Notification | null>;
    deleteNotification(id: string): Promise<void>;
    getNotification(type: NotificationType, receiverId: string, actorId: string, postId?: string, commentId?: string): Promise<Notification | null>;
}

export class NotificationRepository implements INotificationRepository {
    notificationRepository: Repository<NotificationEntity>;
    constructor(appDataSource: DataSource) {
        this.notificationRepository = appDataSource.getRepository(NotificationEntity);
    }
    async createNotification(receiverId: string, actorId: string, type: NotificationType, postId?: string, commentId?: string) {
        return await this.notificationRepository.save({
            receiverId,
            actorId,
            type,
            postId,
            commentId,
            isRead: false,
        })

    }

    async deleteNotification(id: string): Promise<void> {
        await this.notificationRepository.delete(id);
    }

    async getNotification(type: NotificationType, receiverId: string, actorId: string, postId?: string, commentId?: string) {
        return await this.notificationRepository.findOne({
            where: {
                type,
                receiverId,
                actorId,
                postId,
                commentId,
            }
        });
    }

}