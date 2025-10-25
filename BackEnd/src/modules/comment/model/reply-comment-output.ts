export interface ReplyCommentOutput{
    commentId: string,
    userName:string,
    firstName?:string,
    lastName?: string,
    profile?:string,
    content: string,
    date: Date,
    isLiked: boolean,
    likeCount: number,
    hasReply: boolean
}