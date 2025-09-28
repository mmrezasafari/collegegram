import { HttpError } from "../../../utility/http-error";
import { IPostRepository } from "../post/post.repository";
import { PostService } from "../post/post.service";
import { ICommentRepository } from "./comment.repository";
import { CommentOutput } from "./model/comment-output";
import { Comment } from "./model/comment";
import { ReplyCommentOutput } from "./model/reply-comment-output";
import { UserService } from "../user/user.service";
import { ILikeCommentService, LikeCommentService } from "../likeComment/likeComment.service";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification-type.enum";

export class CommentService {
    private likeCommentService!: ILikeCommentService;
    constructor(
        private commentRepo: ICommentRepository,
        private postService: PostService,
        private userService: UserService,
        private notificationService: NotificationService,
    ) { }

    async setLikeComment(likeCommentService: ILikeCommentService) {
        this.likeCommentService = likeCommentService;
    }

    async createCommentAndCreateNotification(postId: string, userId: string, content: string) {
        const post = await this.postService.getPostById(postId, userId)
        const comment = await this.commentRepo.comment(postId, userId, content)
        await this.notificationService.createNotification(post.user!.id, userId, NotificationType.COMMENT, postId, comment.id);
        return { comment, message: "کامنت شما با موفقیت ثبت شد" };
    }

    async getCommentById(commentId: string, userId: string) {
        const comment = await this.commentRepo.getById(commentId)
        if (!comment) {
            throw new HttpError(404, "کامنت یافت نشد");
        }
        const canAccess = await this.userService.canAccessResource(userId, comment.post!.user!.id);
        if (!canAccess) {
            throw new HttpError(403, "شما اجازه دسترسی به این کامنت را ندارید");
        }
        return comment;
    }
    async replyComment(postId: string, userId: string, content: string, parentId: string) {
        const post = await this.postService.getPostById(postId, userId)
        const comment = await this.getCommentById(parentId, userId)
        const replyComment = await this.commentRepo.replyComment(postId, userId, content, parentId)
        return { replyComment, message: "ریپلای شما با موفقیت ثبت شد" }

    }
    async convertToCommentOutput(comment: Comment, userId: string) {
        const user = await this.userService.getUser(comment.userId)
        const canAccess = await this.userService.canAccessResource(userId, user.id);
        if (!canAccess) {
            throw new HttpError(403, "شما اجازه دسترسی به این کاربر را ندارید")
        }
        const isLiked = await this.likeCommentService.isLikedComment(comment.id, userId)
        const likeCount = await this.likeCommentService.getLikesCountComment(comment.id)
        if (user) {
            const commentOutput: CommentOutput = {
                commentId: comment.id,
                userName: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                profile: user.imagePath,
                content: comment.content,
                date: comment.createdAt,
                isLiked: isLiked,
                likeCount: likeCount,
                replies: []
            }
            return commentOutput;
        }
        return null;
    }

    async convertToReplyCommentOutput(comment: Comment, userId: string) {
        const user = await this.userService.getUser(comment.userId)
        const canAccess = await this.userService.canAccessResource(userId, user.id);
        if (!canAccess) {
            throw new HttpError(403, "شما اجازه دسترسی به این کاربر را ندارید")
        }
        const replies = await this.commentRepo.getReplies(comment.id)
        const isLiked = await this.likeCommentService.isLikedComment(comment.id, userId)
        const likeCount = await this.likeCommentService.getLikesCountComment(comment.id)
        if (user) {
            if (replies) {
                const replyCommentOutput: ReplyCommentOutput = {
                    commentId: comment.id,
                    userName: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profile: user.imagePath,
                    content: comment.content,
                    date: comment.createdAt,
                    isLiked: isLiked,
                    likeCount: likeCount,
                    hasReply: true
                }
                return replyCommentOutput;
            } else {
                const replyCommentOutput: ReplyCommentOutput = {
                    commentId: comment.id,
                    userName: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profile: user.imagePath,
                    content: comment.content,
                    date: comment.createdAt,
                    isLiked: isLiked,
                    likeCount: likeCount,
                    hasReply: false
                }
                return replyCommentOutput;
            }
        }
        return null;

    }

    async getComments(postId: string, userId: string) {
        const comments = await this.commentRepo.getComments(postId);
        const commentOutputs: CommentOutput[] = []
        if (comments) {
            for (var comment of comments) {
                if (comment.parentId == null) {
                    let commentOutput = await this.convertToCommentOutput(comment, userId)
                    for (var reply of comments) {
                        if (reply.parentId == comment.id) {
                            let replyOutput = await this.convertToReplyCommentOutput(reply, userId)
                            if (commentOutput && replyOutput) {
                                commentOutput.replies.push(replyOutput)
                            }
                        }
                    }
                }
                return commentOutputs;
            }
            return commentOutputs;
        }
        return commentOutputs;
    }

    async getReplies(commentId: string, userId: string) {
        const replies = await this.commentRepo.getReplies(commentId);
        const repliesOutputs: ReplyCommentOutput[] = [];
        if (replies) {
            for (var reply of replies) {
                let replyOutput = await this.convertToReplyCommentOutput(reply, userId);
                if (replyOutput) {
                    repliesOutputs.push(replyOutput)
                }
            }
        }
        return repliesOutputs;

    }

    async getCommentCount(postId: string) {
        return await this.commentRepo.countComment(postId);
    }

}