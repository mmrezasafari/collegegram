import { DataSource, Repository } from "typeorm";
import { NotificationEntity } from "./notification.entity";
import { NotificationType } from "./notification-type.enum";
import { Notification, NotificationDetails } from "./models/notification";


export interface INotificationRepository {
    createNotification(receiverId: string, actorId: string, type: NotificationType, postId?: string, commentId?: string): Promise<Notification | null>;
    deleteNotification(id: string): Promise<void>;
    getNotification(type: NotificationType, receiverId: string, actorId: string, postId?: string, commentId?: string): Promise<Notification | null>;
    getMyNotifications(userId: string, offset: number, limit: number): Promise<NotificationDetails[]>;
    getFriendsNotifications(userId: string, friendsId: string[], offset: number, limit: number): Promise<NotificationDetails[]>;
    markAsRead(notificationIds: string[]): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
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

    async getMyNotifications(userId: string, offset: number, limit: number) {
        return await this.notificationRepository
            .createQueryBuilder("notification")
            .leftJoinAndSelect("notification.actor", "actor")
            .leftJoinAndSelect("notification.post", "post")
            .leftJoinAndSelect("post.images", "postImages")
            .leftJoinAndSelect("notification.comment", "comment")
            .where("notification.receiverId = :userId", { userId })
            .orderBy("notification.isRead", "ASC")
            .addOrderBy("notification.createdAt", "DESC")
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async getFriendsNotifications(userId: string, friendsId: string[], offset: number, limit: number) {
        return await this.notificationRepository
            .createQueryBuilder("notification")
            .leftJoinAndSelect("notification.actor", "actor")
            .leftJoinAndSelect("notification.receiver", "receiver")
            .leftJoinAndSelect("notification.post", "post")
            .leftJoinAndSelect("post.images", "postImages")
            .leftJoinAndSelect("notification.comment", "comment")
            .where("notification.actorId IN (:...ids)", { ids: friendsId })
            .andWhere("notification.type NOT IN (:...excludedTypes)", { excludedTypes: ["FOLLOW_REQUEST", "TAG"] })
            .andWhere("notification.receiverId != :userId", { userId })
            .orderBy("notification.createdAt", "DESC")
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async markAsRead(notificationIds: string[]) {
        await this.notificationRepository
            .createQueryBuilder()
            .update()
            .set({ isRead: true })
            .whereInIds(notificationIds)
            .execute();
    }

    async getUnreadCount(userId: string) {
        return this.notificationRepository.count({
            where: {
                receiverId: userId,
                isRead: false,
            },
        });
    }

}