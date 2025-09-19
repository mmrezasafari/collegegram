export interface IComment {
  commentId: string
  userName: string
  firstName: string
  lastName: string
  profile: string
  content: string
  date: string
  replies: Array<
    IComment & {
      hasReply: boolean
    }
  >
}

export interface IReplyComment {
  commentId: string
  userName: string
  firstName: string
  lastName: string
  profile: string
  content: string
  date: string
  hasReply: boolean
}

export interface IReplyCommentRes {
  success: boolean
  data: Array<IReplyComment>
}

export interface ICommentRes {
  data: Array<IComment>
  success: boolean
}

export interface ICommentBody {
  content: string
  parentId: string | null
}

export interface IPostCommentRes {
  data: {
    message: string
    replyComment: IComment
  }
  success: boolean
}
