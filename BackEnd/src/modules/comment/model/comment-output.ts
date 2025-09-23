import { ReplyCommentOutput } from "./reply-comment-output"
export interface CommentOutput {
    commentId: string,
    userName: string,
    firstName?: string,
    lastName?: string,
    profile?: string,
    content: string,
    date: Date,
    isLiked: boolean,
    likeCount: number,
    replies: ReplyCommentOutput[]
}