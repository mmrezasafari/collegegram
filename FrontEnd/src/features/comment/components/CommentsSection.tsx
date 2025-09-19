import { useGetComments } from '../hooks/useComments'
import { CommentItem } from './CommentItem'
import { CommentInputeArea } from './CommentInputArea'
import { useState } from 'react'
import { Separator } from '@radix-ui/react-separator'
import type { IReplyComment } from '@/types/comment'
import { getRepliesComment } from '../hooks/useComments' // your fetch function
import { Reply } from 'lucide-react'
import { Badge } from '@/features/common/components/ui/badge'

export const CommentSection = ({ postId }: { postId: string }) => {
  const { data: pureComments } = useGetComments(postId)
  const comments = pureComments?.data

  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyUser, setReplyUser] = useState<string | null>(null)

  // Store replies for each comment individually
  const [allReplies, setAllReplies] = useState<Record<string, IReplyComment[]>>(
    {},
  )
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set())

  // Fetch replies for a specific comment
  const onGetReplies = async (commentId: string) => {
    if (allReplies[commentId] || loadingReplies.has(commentId)) return

    setLoadingReplies((prev) => new Set(prev).add(commentId))
    try {
      const { data } = await getRepliesComment(postId, commentId)
      setAllReplies((prev) => ({ ...prev, [commentId]: data }))
    } catch (err) {
      console.error('Failed to load replies:', err)
    } finally {
      setLoadingReplies((prev) => {
        const newSet = new Set(prev)
        newSet.delete(commentId)
        return newSet
      })
    }
  }

  // Recursive component to render replies
  const ReplyList = ({ replies }: { replies: IReplyComment[] }) => {
    return (
      <>
        {replies.map((reply) => (
          <div
            key={reply.commentId}
            className="flex flex-col gap-4 pr-2 md:pr-4"
          >
            <div className="flex gap-4">
              <Reply className="rotate-x-180" />
              <div className="w-full">
                <CommentItem
                  comment={reply}
                  onReply={(id, user) => {
                    setReplyTo(id)
                    setReplyUser(user)
                  }}
                />
              </div>
            </div>
            {reply.hasReply && (
              <>
                {!allReplies[reply.commentId] && (
                  <button
                    className="text-xs text-primary self-end cursor-pointer"
                    onClick={() => onGetReplies(reply.commentId)}
                    disabled={loadingReplies.has(reply.commentId)}
                  >
                    {loadingReplies.has(reply.commentId)
                      ? 'در حال بارگذاری...'
                      : 'بیشتر'}
                  </button>
                )}
                {allReplies[reply.commentId] && (
                  <ReplyList replies={allReplies[reply.commentId]} />
                )}
              </>
            )}
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Comment input area */}
      <CommentInputeArea
        postId={postId}
        parentId={replyTo}
        replyUser={replyUser}
        onCancelReply={() => {
          setReplyTo(null)
          setReplyUser(null)
        }}
      />

      {/* Comments list */}
      <div className="flex flex-col gap-4 overflow-y-auto max-md:max-h-54 h-[calc(100vh-600px)] p-2">
        {comments?.length ? (
          comments?.map((comment) => (
            <div key={comment.commentId} className="flex flex-col gap-4">
              <CommentItem
                comment={comment}
                onReply={(id, user) => {
                  setReplyTo(id)
                  setReplyUser(user)
                }}
              />
              {/* Render first-level replies */}
              {comment.replies?.length > 0 && (
                <ReplyList replies={comment.replies} />
              )}
              <Separator className="border border-geryLight" />
            </div>
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
