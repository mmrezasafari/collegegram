import { HttpError } from "../../../utility/http-error";
import { IPostRepository } from "../post/post.repository";
import { PostService } from "../post/post.service";
import { ICommentRepository } from "./comment.repository";


export class CommentService {
    constructor(
        private commentRepo: ICommentRepository,
        private postService: PostService
    ) { }

    async comment(postId:string, userId:string, content:string){
        const post = await this.postService.getPostById(postId)
        const comment = await this.commentRepo.comment(postId, userId, content)
        return {comment, message: "کامنت شما با موفقیت ثبت شد" };
    }

    async getCommentById(commentId:string){
        const comment = await this.commentRepo.getById(commentId)
        if (!comment) {
            throw new HttpError(404, "کامنت یافت نشد");
        }
        return comment;
    }
    async replyComment(postId:string, userId:string, content:string, parentId:string){
        const post = await this.postService.getPostById(postId)
        const comment = await this.getCommentById(parentId)
        const replyComment = await this.commentRepo.replyComment(postId, userId, content, parentId)
        return {replyComment, message: "ریپلای شما با موفقیت ثبت شد" }

    }

    // async getComments(postId: string){
    // return await this.commentRepo.getComments(postId);
    // }

}