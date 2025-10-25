import { HttpError } from "../../../utility/http-error";
import { NotificationType } from "../notification/notification-type.enum";
import { NotificationService } from "../notification/notification.service";
import { IPostRepository } from "../post/post.repository";
import { PostService } from "../post/post.service";
import { ILikeRepository } from "./like.repository";


export class LikeService {
    constructor(
        private likeRepo: ILikeRepository,
        private postService: PostService,
        private notificationService: NotificationService,

    ) { }

    async likePostAndCreateNotification(postId: string, userId: string,) {
        const post = await this.postService.getPostById(postId, userId)
        if (!post || !post.user) {
            throw new HttpError(404, "پست مورد نظر یافت نشد");
        }
        const existingLike = await this.likeRepo.liked(postId, userId)
        if (existingLike) {
            throw new HttpError(400, "شما این پست را لایک کرده اید");
        }
        await this.likeRepo.like(postId, userId)
        await this.notificationService.createNotification(
            post.user.id,
            userId,
            NotificationType.LIKE,
            postId
        )
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