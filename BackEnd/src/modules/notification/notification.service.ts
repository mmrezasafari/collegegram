import { HttpError } from "../../../utility/http-error";
import { FollowService, IFollowService } from "../follow/follow.service";
import { NotificationDetails } from "./models/notification";
import { NotificationType } from "./notification-type.enum";
import { INotificationRepository } from "./notification.repository";


export class NotificationService {
    private followService!: IFollowService;
    constructor(
        private notificationRepo: INotificationRepository,
    ) { }
    async setFollowService(followService: IFollowService) {
        this.followService = followService;
    }

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

    async getMyNotifications(userId: string, offset: number, limit: number) {
        const notifications = await this.notificationRepo.getMyNotifications(userId, offset, limit);

        const notificationDetails: NotificationDetails[] = notifications.map((notification) => ({
            id: notification.id,
            type: notification.type,
            actor: {
                id: notification.actor.id,
                username: notification.actor.username,
                email: notification.actor.email,
                isPrivate: notification.actor.isPrivate,
                firstName: notification.actor.firstName,
                lastName: notification.actor.lastName,
                imagePath: notification.actor.imagePath,
            },
            post: notification.post ?? null,
            comment: notification.comment ?? null,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        }));

        const unreadNotificationIds = notifications
            .filter((notification) => !notification.isRead)
            .map((notification) => notification.id);

        if (unreadNotificationIds.length > 0) {
            await this.notificationRepo.markAsRead(unreadNotificationIds);
        }

        return notificationDetails;
    }

    async getFriendsNotifications(userId: string, offset: number, limit: number) {
        const followings = await this.followService.getFollows(userId, "followings");
        const followingsId = followings.map(following => following.followingId);

        const notifications = await this.notificationRepo.getFriendsNotifications(userId, followingsId, offset, limit);

        const notificationDetails: NotificationDetails[] = notifications.map((notification) => ({
            id: notification.id,
            type: notification.type,
            actor: {
                id: notification.actor.id,
                username: notification.actor.username,
                email: notification.actor.email,
                isPrivate: notification.actor.isPrivate,
                firstName: notification.actor.firstName,
                lastName: notification.actor.lastName,
                imagePath: notification.actor.imagePath,
            },
            reciver: notification.receiver
                ? {
                    id: notification.receiver.id,
                    username: notification.receiver.username,
                    email: notification.receiver.email,
                    isPrivate: notification.receiver.isPrivate,
                    firstName: notification.receiver.firstName,
                    lastName: notification.receiver.lastName,
                    imagePath: notification.receiver.imagePath,
                }
                : null,
            post: notification.post ?? null,
            comment: notification.comment ?? null,
            createdAt: notification.createdAt,
        }));
        
        return notificationDetails;
    }

    async getUnreadCount(userId: string) {
        const unreadCount = await this.notificationRepo.getUnreadCount(userId);
        return { unreadCount };
    }
}