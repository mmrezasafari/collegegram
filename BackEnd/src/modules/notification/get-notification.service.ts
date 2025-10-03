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
            notifications
            .filter((n) => n.actor.id !== userId)
            .map(async (notification) => {
                let post = notification.post ?? null;

                if (notification.post) {
                    const canAccess = await this.userService.canAccessResource(userId, notification.actor.id);
                    if (!canAccess) {
                        post = null;
                    }
                    const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, notification.actor.id );
                    if (notification.post.onlyCloseFriends && !isCloseFriend) {
                        post = null;
                    }
                }

                const isFollowing = await this.followService.isFollowing(userId, notification.actor.id);

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
                        isFollowing: isFollowing,
                    },
                    post,
                    comment: notification.comment,
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
            notifications
                .filter((n) => n.actor.id !== n.receiver!.id)
                .map(async (notification) => {

                    if (notification.post) {
                        const canAccess = await this.userService.canAccessResource(userId, notification.receiver!.id);
                        if (!canAccess) { return null; }

                        const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, notification.receiver!.id);
                        if (notification.post.onlyCloseFriends && !isCloseFriend) { return null; }
                    }

                    const isFollowing = await this.followService.isFollowing(userId, notification.receiver!.id);

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
                        receiver: notification.receiver
                            ? {
                                id: notification.receiver.id,
                                username: notification.receiver.username,
                                email: notification.receiver.email,
                                isPrivate: notification.receiver.isPrivate,
                                firstName: notification.receiver.firstName,
                                lastName: notification.receiver.lastName,
                                imagePath: notification.receiver.imagePath,
                                isFollowing: isFollowing,
                            }
                            : null,
                        post: notification.post,
                        comment: notification.comment,
                        createdAt: notification.createdAt,
                    };
                })
        );

        return notificationDetails.filter((n) => n !== null);
    }

}