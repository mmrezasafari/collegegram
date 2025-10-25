import { HttpError } from "../../../utility/http-error";
import { CloseFriendService } from "../closeFriend/close-friend.service";
import { Post } from "../post/model/post";
import { PostService } from "../post/post.service";
import { UserService } from "../user/user.service";
import { ISaveRepository } from "./saved-post.repository";


export class SaveService {
    constructor(
        private saveRepo: ISaveRepository,
        private postService: PostService,
        private closeFriendService: CloseFriendService,
        private userService: UserService,
    ) { }

    async savePost(postId: string, userId: string,) {
        const post = await this.postService.getPostById(postId, userId)
        const existingSave = await this.saveRepo.isSaved(postId, userId)
        if (existingSave) {
            throw new HttpError(400, "شما این پست را ذخیره دارید");
        }
        await this.saveRepo.save(postId, userId)
        return { message: "پست با موفقیت ذخیره شد" };
    }

    async unSavePost(postId: string, userId: string,) {
        const post = await this.postService.getPostById(postId, userId)
        const existingSave = await this.saveRepo.isSaved(postId, userId)
        if (!existingSave) {
            throw new HttpError(400, "شما این پست را ذخیره نکرده اید");
        }
        await this.saveRepo.unSave(postId, userId)
        return { message: "ذخبره پست با موفقیت حذف شد" }

    }

    async getSaveCount(postId: string) {
        return await this.saveRepo.countSave(postId);
    }

    async saved(postId: string, userId: string) {
        const existingSave = await this.saveRepo.isSaved(postId, userId)
        return !!existingSave;
    }

    async getSavePage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC") {
        const savePosts = await this.saveRepo.getSavePage(userId, offset, limit, sort);
        if (!savePosts) return [];

        const posts: Post[] = [];
        for (const post of savePosts) {
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

