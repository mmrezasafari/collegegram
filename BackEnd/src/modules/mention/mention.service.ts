import { CloseFriendService } from "../closeFriend/close-friend.service";
import { NotificationType } from "../notification/notification-type.enum";
import { NotificationService } from "../notification/notification.service";
import { Post } from "../post/model/post";
import { UserService } from "../user/user.service";
import { IMentionRepository } from "./mention.repository";


export class MentionService {
    constructor(
        private mentionRepo: IMentionRepository,
        private userService: UserService,
        private closeFriendService: CloseFriendService,
        private notificationService: NotificationService,
    ) { }

    async savePostMentionAndCreateNotification(usernames: string[], postId: string, myId: string): Promise<string[]> {
        const savedUsernames: string[] = [];
        for (const username of usernames) {
            const mentionedUser = await this.userService.getUserByUsername(username);
            if (mentionedUser) {
                await this.mentionRepo.saveMention(mentionedUser.id, postId)
                savedUsernames.push(username);
                await this.notificationService.createNotification(
                    mentionedUser.id,
                    myId,
                    NotificationType.TAG,
                    postId
                )
            }
        }
        return savedUsernames;

    }

    async getMentionedUsernames(postId: string): Promise<string[]> {
        return this.mentionRepo.getUsernames(postId);
    }

    async removePostMentions(postId: string) {
        await this.mentionRepo.deleteMentionsByPostId(postId);
    }

    async getMentionPage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC") {
        const mentionPosts = await this.mentionRepo.getMentionPage(userId, offset, limit, sort);
        if (!mentionPosts) return [];

        const posts: Post[] = [];
        for (const post of mentionPosts) {
            const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, post.user!.id);
            if (post.onlyCloseFriends && !isCloseFriend) {
                continue;
            }
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