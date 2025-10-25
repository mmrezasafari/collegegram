import { CloseFriendService } from "../closeFriend/close-friend.service";
import { NotificationType } from "../notification/notification-type.enum";
import { NotificationService } from "../notification/notification.service";
import { Post } from "../post/model/post";
import { User } from "../user/model/user";
import { UserService } from "../user/user.service";
import { IMentionRepository } from "./mention.repository";


export class MentionService {
    constructor(
        private mentionRepo: IMentionRepository,
        private closeFriendService: CloseFriendService,
        private notificationService: NotificationService,
        private userService: UserService,
    ) { }

    async savePostMentionAndCreateNotification(mentionedUsers: User[], postId: string, myId: string): Promise<string[]> {
        const savedUsernames: string[] = [];
        for (const mentionedUser of mentionedUsers) {
            await this.mentionRepo.saveMention(mentionedUser.id, postId)
            savedUsernames.push(mentionedUser.username);
            await this.notificationService.createNotification(
                mentionedUser.id,
                myId,
                NotificationType.TAG,
                postId
            )
        }
        return savedUsernames;

    }

    async getMentionedUsernames(postId: string): Promise<string[]> {
        return this.mentionRepo.getUsernames(postId);
    }

    async removePostMentionsAndRemoveNotification(userId: string, postId: string) {
        const mentions: string[] = await this.getMentionedUsernames(postId);

        await this.mentionRepo.deleteMentionsByPostId(postId);
        
        if (!mentions.length) return;

        const users = await this.userService.getUsersByUsernames(mentions) ?? [];
        const usersId = users.map((u) => u.id);

        if (usersId.length > 0) {
            await this.notificationService.deleteNotifications(userId, usersId, NotificationType.TAG, postId);
        }
    }

    async getMentionPage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC") {
        const mentionPosts = await this.mentionRepo.getMentionPage(userId, offset, limit, sort);
        if (!mentionPosts) return [];

        const posts: Post[] = [];
        for (const post of mentionPosts) {
            const canAccess = await this.userService.canAccessResource(userId, post.user!.id);
            if (!canAccess) continue;
            
            const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, post.user!.id);
            if (post.onlyCloseFriends && !isCloseFriend) continue;

            posts.push({
                id: post.id,
                caption: post.caption,
                onlyCloseFriends: post.onlyCloseFriends,
                images: post.images,
                createdAt: post.createdAt,
            });
        }
        return posts;
    }
}