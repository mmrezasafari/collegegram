import { CloseFriendService } from "../closeFriend/close-friend.service";
import { FollowService } from "../follow/follow.service";
import { UserService } from "../user/user.service";
import { NotificationDetails } from "./models/notification";
import { NotificationService } from "./notification.service";


export class GetNotificationService {
    constructor(
        private userService: UserService,
        private closeFriendService: CloseFriendService,
        private followService: FollowService,
        private notificationService: NotificationService,
    ) { }

    async getMyNotifications(userId: string, offset: number, limit: number) {
        const notifications = await this.notificationService.getMyNotifications(userId, offset, limit);

        const notificationDetails: NotificationDetails[] = await Promise.all(
            notifications.map(async (notification) => {
                let post = notification.post ?? null;
                let comment = notification.comment ?? null;

                if (notification.post) {
                    const canAccess = await this.userService.canAccessResource(userId, notification.actor.id);
                    if (!canAccess) {
                        post = null;
                        comment = null;
                    }
                    const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, notification.actor.id );
                    if (notification.post.onlyCloseFriends && !isCloseFriend) {
                        post = null;
                        comment = null;
                    }
                }

                return {
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
                    post,
                    comment,
                    isRead: notification.isRead,
                    createdAt: notification.createdAt,
                };
            })
        );

        const unreadNotificationIds = notifications
            .filter((notification) => !notification.isRead)
            .map((notification) => notification.id);

        if (unreadNotificationIds.length > 0) {
            await this.notificationService.markAsRead(unreadNotificationIds);
        }

        return notificationDetails;
    }


    async getFriendsNotifications(userId: string, offset: number, limit: number) {
        const followings = await this.followService.getFollows(userId, "followings");
        const followingsId = followings.map(following => following.followingId);

        const notifications = await this.notificationService.getFriendsNotifications(userId, followingsId, offset, limit);

        const notificationDetails = await Promise.all(
            notifications.map(async (notification) => {
                let post = notification.post ?? null;
                let comment = notification.comment ?? null;

                if (notification.post) {
                    const canAccess = await this.userService.canAccessResource(userId, notification.receiver!.id);
                    if (!canAccess) {
                        post = null;
                        comment = null;
                    }
                    const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, notification.receiver!.id);
                    if (notification.post.onlyCloseFriends && !isCloseFriend) {
                        post = null;
                        comment = null;
                    }
                }

                return {
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
                    post,
                    comment,
                    createdAt: notification.createdAt,
                };
            })
        );

        return notificationDetails;
    }

}