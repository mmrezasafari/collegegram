import { HttpError } from "../../../utility/http-error";
import { IPostRepository } from "../post/post.repository";
import { PostService } from "../post/post.service";
import { ILikeRepository } from "./like.repository";


export class LikeService {
    constructor(
        private likeRepo: ILikeRepository,
        private postService: PostService
    ) { }

    async likePost(postId: string, userId: string,) {
        const post = await this.postService.getPostById(postId, userId)
        const existingLike = await this.likeRepo.liked(postId, userId)
        if (existingLike) {
            throw new HttpError(400, "شما این پست را لایک کرده اید");
        }
        await this.likeRepo.like(postId, userId)
        return { message: "لایک کردن با موفقیت ثبت شد" };
    }

    async unLikePost(postId: string, userId: string,) {
        const post = await this.postService.getPostById(postId, userId)
        const existingLike = await this.likeRepo.liked(postId, userId)
        if (!existingLike) {
            throw new HttpError(400, "شما این پست را لایک نکرده اید");
        }
        await this.likeRepo.unLike(postId, userId)
        return { message: "لایک با موفقیت حذف شد" }

    }

    async getLikesCount(postId: string) {
        return await this.likeRepo.countLike(postId);
    }

    async liked(postId: string, userId: string) {
        const existingLike = await this.likeRepo.liked(postId, userId)
        return !!existingLike;
    }

}