import { HttpError } from "../../../utility/http-error";
import { IPostRepository } from "../post/post.repository";
import { CommentService } from "../comment/comment.service";
import { ILikeCommentRepository } from "./likeComment.repository"

export interface ILikeCommentService{
    likeComment(commentId:string, userId:string):Promise<{ message: string }>;
    unLikeComment(commentId:string, userId:string):Promise<{ message: string }>;
    getLikesCountComment(commentId: string): Promise<number>;
    isLikedComment(commentId: string, userId: string): Promise<boolean>;
}

export class LikeCommentService implements ILikeCommentService{
    constructor(
        private likeCommentRepo: ILikeCommentRepository,
        private commentService: CommentService
    ) { }

    async likeComment(commentId:string, userId:string){
        const comment = await this.commentService.getCommentById(commentId)
        const existingLike = await this.likeCommentRepo.isLiked(commentId,userId)
        if (existingLike) {
            throw new HttpError(400, "شما این کامنت را لایک کرده اید");
        }
        await this.likeCommentRepo.like(commentId, userId)
        return { message: "لایک کردن با موفقیت ثبت شد" };
    }

    async unLikeComment(commentId:string, userId:string,){
        const comment = await this.commentService.getCommentById(commentId)
        const existingLike = await this.likeCommentRepo.isLiked(commentId,userId)
        if (!existingLike) {
            throw new HttpError(400, "شما این کامنت را لایک نکرده اید");
        }
        await this.likeCommentRepo.unLike(commentId,userId)
        return { message: "لایک با موفقیت حذف شد" }

    }

    async getLikesCountComment(commentId: string){
    return await this.likeCommentRepo.countLike(commentId);
    }
    
    async isLikedComment(commentId: string, userId: string): Promise<boolean> {
    const existingLike = await this.likeCommentRepo.isLiked(commentId, userId);
    return existingLike !== null;
    }

}