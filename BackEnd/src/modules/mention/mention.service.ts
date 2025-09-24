import { Post } from "../post/model/post";
import { UserService } from "../user/user.service";
import { IMentionRepository } from "./mention.repository";


export class MentionService {
    constructor(
        private mentionRepo: IMentionRepository,
        private userService: UserService
    ) { }

    async savePostMention(usernames: string[], postId: string) {
        const savedUsernames: string[] = [];
        for (const username of usernames) {
            const mentionedUser = await this.userService.getUserByUsername(username);
            if (mentionedUser) {
                await this.mentionRepo.saveMention(mentionedUser.id, postId)
                savedUsernames.push(username);
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
        return this.mentionRepo.getMentionPage(userId, offset, limit, sort);
    }


}