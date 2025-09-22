import type { IComment, IReplyComment } from '@/types/comment'
import { Heart, Reply } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useToggleLikeComment } from '../hooks/useLikeComment'

dayjs.extend(relativeTime)
dayjs.locale('fa')

interface IProps {
  comment: IComment | IReplyComment
  postId: string
  onReply: (_id: string, _user: string) => void
}

export const CommentItem = ({ comment, onReply, postId }: IProps) => {
  const { mutate: likeCommentMutate } = useToggleLikeComment(
    postId,
    comment && comment.commentId,
  )

  const onToggleLike = () => {
    likeCommentMutate('like')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-sm text-justify">
            {comment.firstName ? (
              <span>
                {comment.firstName} {comment.lastName}
              </span>
            ) : (
              <span>@{comment.userName}</span>
            )}
          </p>
          <p className="text-xs text-gray-400">
            {dayjs(comment.date).fromNow()}
          </p>
        </div>
        <div className="flex gap-2 md:gap-4 items-end text-primary font-bold text-xs md:text-sm">
          <Heart size={16} className="cursor-pointer" onClick={onToggleLike} />
          <div
            className="flex items-end gap-1 cursor-pointer"
            onClick={() =>
              onReply(
                comment.commentId,
                comment.firstName
                  ? `${comment.firstName} ${comment.lastName}`
                  : comment.userName,
              )
            }
          >
            <span>پاسخ</span>
            <Reply size={22} />
          </div>
        </div>
      </div>
      <p className="text-xs md:text-sm font-thin text-justify">
        {comment.content}
      </p>
    </div>
  )
}
