import { useGetComments, useGetRepliesComment } from '../hooks/useComments'
import { CommentItem } from './CommentItem'
import { CommentInputeArea } from './CommentInputArea'
import { useState } from 'react'
import { Separator } from '@radix-ui/react-separator'
import type { IReplyComment, IComment } from '@/types/comment'
import { Reply } from 'lucide-react'
import { Badge } from '@/features/common/components/ui/badge'
import { Loading } from '@/features/common/components/ui/loading'

export const CommentSection = ({ postId }: { postId: string }) => {
  const { data: pureComments, isPending } = useGetComments(postId)
  const comments = pureComments?.data

  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyUser, setReplyUser] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <CommentInputeArea
        postId={postId}
        parentId={replyTo}
        replyUser={replyUser}
        onCancelReply={() => {
          setReplyTo(null)
          setReplyUser(null)
        }}
      />

      <div className="flex flex-col gap-4 overflow-y-auto max-md:max-h-54 h-[calc(100vh-600px)] p-2">
        {isPending ? (
          <Loading className="justify-center" />
        ) : comments?.length ? (
          comments.map((comment) => (
            <CommentThread
              key={comment.commentId}
              comment={comment}
              postId={postId}
              setReplyTo={setReplyTo}
              setReplyUser={setReplyUser}
            />
          ))
        ) : (
          <Badge
            variant="outline"
            className="self-center text-gray-400 text-sm"
          >
            نظری ثبت نشده
          </Badge>
        )}
      </div>
    </div>
  )
}

const CommentThread = ({
  comment,
  postId,
  setReplyTo,
  setReplyUser,
}: {
  comment: IComment
  postId: string
  setReplyTo: (_id: string | null) => void
  setReplyUser: (_user: string | null) => void
}) => {
  return (
    <div className="flex flex-col gap-4">
      <CommentItem
        postId={postId}
        comment={comment}
        onReply={(id, user) => {
          setReplyTo(id)
          setReplyUser(user)
        }}
      />
      {comment.replies?.length > 0 && (
        <ReplyList
          replies={comment.replies}
          postId={postId}
          parentId={comment.commentId}
          setReplyTo={setReplyTo}
          setReplyUser={setReplyUser}
        />
      )}
      <Separator className="border border-geryLight" />
    </div>
  )
}

const ReplyList = ({
  replies,
  postId,
  parentId,
  setReplyTo,
  setReplyUser,
}: {
  replies: IReplyComment[]
  postId: string
  parentId: string
  setReplyTo: (_id: string | null) => void
  setReplyUser: (_user: string | null) => void
}) => {
  return (
    <>
      {replies.map((reply) => (
        <div key={reply.commentId} className="flex flex-col gap-4 pr-2">
          <div className="flex gap-1">
            <Reply className="rotate-x-180" />
            <div className="w-full">
              <CommentItem
                comment={reply}
                postId={postId}
                parentId={parentId}
                onReply={(id, user) => {
                  setReplyTo(id)
                  setReplyUser(user)
                }}
              />
            </div>
          </div>

          {reply.hasReply && (
            <RepliesFetcher
              postId={postId}
              commentId={reply.commentId}
              setReplyTo={setReplyTo}
              setReplyUser={setReplyUser}
            />
          )}
        </div>
      ))}
    </>
  )
}

const RepliesFetcher = ({
  postId,
  commentId,
  setReplyTo,
  setReplyUser,
}: {
  postId: string
  commentId: string
  setReplyTo: (_id: string | null) => void
  setReplyUser: (_user: string | null) => void
}) => {
  const { data, isLoading, refetch } = useGetRepliesComment(postId, commentId)
  const [expanded, setExpanded] = useState(false)

  const handleClick = async () => {
    setExpanded(true)
    await refetch()
  }

  if (!expanded) {
    return (
      <button
        className="text-xs text-primary self-end cursor-pointer"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? <Loading /> : 'بیشتر'}
      </button>
    )
  }

  if (isLoading) return <Loading />
  if (!data?.data?.length) return null

  return (
    <ReplyList
      replies={data.data}
      postId={postId}
      parentId={commentId}
      setReplyTo={setReplyTo}
      setReplyUser={setReplyUser}
    />
  )
}
