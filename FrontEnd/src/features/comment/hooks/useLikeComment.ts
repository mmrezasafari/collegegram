import api from '@/lib/axios'
import type {
  IComment,
  ICommentRes,
  IReplyComment,
  IReplyCommentRes,
} from '@/types/comment'
import type { IErrorRes, ISuccessRes } from '@/types/error'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

type TMutationVar = 'like' | 'unlike'
type ToggleLikeContext = {
  prevComments?: ICommentRes
  prevReplies?: IReplyCommentRes
}

export async function toggleLikeComment(
  commentId: string,
  action: TMutationVar,
): Promise<ISuccessRes> {
  if (action === 'like') {
    const res = await api.post<ISuccessRes>(`/comments/${commentId}/like`)
    return res.data
  } else {
    const res = await api.delete<ISuccessRes>(`/comments/${commentId}/unlike`)
    return res.data
  }
}

export function useToggleLikeComment(
  postId: string,
  commentId: string,
  parentId?: string, // optional, only needed for replies
) {
  const queryClient = useQueryClient()

  return useMutation<
    ISuccessRes,
    AxiosError<IErrorRes>,
    TMutationVar,
    ToggleLikeContext
  >({
    mutationKey: ['comment', commentId, 'like'],
    mutationFn: (action) => toggleLikeComment(commentId, action),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })
      if (parentId) {
        await queryClient.cancelQueries({
          queryKey: ['replies', postId, parentId],
        })
      }

      const prevComments = queryClient.getQueryData<ICommentRes>([
        'comments',
        postId,
      ])
      const prevReplies = parentId
        ? queryClient.getQueryData<IReplyCommentRes>([
            'replies',
            postId,
            parentId,
          ])
        : undefined

      // Optimistically update top-level comments
      if (prevComments) {
        const updatedComments: IComment[] = prevComments.data.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            }
          }

          // Update nested replies if needed
          const updatedReplies = comment.replies.map((reply) =>
            reply.commentId === commentId
              ? {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likeCount: reply.isLiked
                    ? reply.likeCount - 1
                    : reply.likeCount + 1,
                }
              : reply,
          )

          return { ...comment, replies: updatedReplies }
        })

        queryClient.setQueryData<ICommentRes>(['comments', postId], {
          ...prevComments,
          data: updatedComments,
        })
      }

      // Optimistically update reply cache
      if (prevReplies) {
        const updatedReplies: IReplyComment[] = prevReplies.data.map((reply) =>
          reply.commentId === commentId
            ? {
                ...reply,
                isLiked: !reply.isLiked,
                likeCount: reply.isLiked
                  ? reply.likeCount - 1
                  : reply.likeCount + 1,
              }
            : reply,
        )

        queryClient.setQueryData<IReplyCommentRes>(
          ['replies', postId, parentId!],
          {
            ...prevReplies,
            data: updatedReplies,
          },
        )
      }

      return { prevComments, prevReplies }
    },

    onError: (_err, _vars, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(['comments', postId], context.prevComments)
      }
      if (context?.prevReplies && parentId) {
        queryClient.setQueryData(
          ['replies', postId, parentId],
          context.prevReplies,
        )
      }
    },
  })
}
