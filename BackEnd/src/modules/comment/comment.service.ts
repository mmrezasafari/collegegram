import { HttpError } from "../../../utility/http-error";
import { IPostRepository } from "../post/post.repository";
import { PostService } from "../post/post.service";
import { ICommentRepository } from "./comment.repository";
import { CommentOutput } from "./model/comment-output";
import { Comment } from "./model/comment";
import { ReplyCommentOutput } from "./model/reply-comment-output";
import { UserService } from "../user/user.service";

export class CommentService {
    constructor(
        private commentRepo: ICommentRepository,
        private postService: PostService,
        private userService: UserService
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
    async convertToCommentOutput(comment:Comment){
        const user = await this.userService.getUser(comment.userId)
        if(user){
            const commentOutput:CommentOutput={
                commentId: comment.id,
                userName:user.username,
                firstName:user.firstName,
                lastName: user.lastName,
                profile:user.imagePath,
                content: comment.content,
                date:comment.createdAt,
                replies: []
            }
            return commentOutput;
        }
        return null;
    }

    async convertToReplyCommentOutput(comment:Comment){
        const user = await this.userService.getUser(comment.userId)
        const replies = await this.commentRepo.getReplies(comment.id)
        if(user){
            if(replies){
                const replyCommentOutput:ReplyCommentOutput={
                    commentId: comment.id,
                    userName:user.username,
                    firstName:user.firstName,
                    lastName: user.lastName,
                    profile:user.imagePath,
                    content: comment.content,
                    date:comment.createdAt,
                    hasReply:true   
                }
                return replyCommentOutput;
            }else{
                const replyCommentOutput:ReplyCommentOutput={
                    commentId: comment.id,
                    userName:user.username,
                    firstName:user.firstName,
                    lastName: user.lastName,
                    profile:user.imagePath,
                    content: comment.content,
                    date:comment.createdAt,
                    hasReply:false   
                }
                return replyCommentOutput;
            }
        }
        return null;

    }

    async getComments(postId: string){
    const comments =  await this.commentRepo.getComments(postId);
    const commentOutputs : CommentOutput[] = []
    if(comments){
        for(var comment of comments){
            if(comment.parentId == null){
                let commentOutput = await this.convertToCommentOutput(comment)
                for(var reply of comments){
                    if(reply.parentId == comment.id){
                        let replyOutput = await this.convertToReplyCommentOutput(reply)
                        if(commentOutput && replyOutput){
                            commentOutput.replies.push(replyOutput)
                        }
                    }
                }
                if(commentOutput){
                    commentOutputs.push(commentOutput)
                }
            }
        }
    }
    return commentOutputs;
    }
    async getReplies(commentId: string){
        const replies = await this.commentRepo.getReplies(commentId);
        const repliesOutputs : ReplyCommentOutput[] = [];
        if(replies && replies.length>1){
            for(var reply of replies){
                let replyOutput = await this.convertToReplyCommentOutput(reply);
                if(replyOutput){
                repliesOutputs.push(replyOutput)
                }
            }
        }
        return repliesOutputs;

    }

}