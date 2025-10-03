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
  parentId?: string,
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

    onMutate: async (action) => {
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

      // Optimistic update: top-level comments
      if (prevComments) {
        const updatedComments: IComment[] = prevComments.data.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              isLiked: action === 'like',
              likeCount: comment.likeCount + (action === 'like' ? 1 : -1),
            }
          }

          const updatedReplies = comment.replies.map((reply) =>
            reply.commentId === commentId
              ? {
                ...reply,
                isLiked: action === 'like',
                likeCount: reply.likeCount + (action === 'like' ? 1 : -1),
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

      // Optimistic update: reply cache
      if (prevReplies) {
        const updatedReplies: IReplyComment[] = prevReplies.data.map((reply) =>
          reply.commentId === commentId
            ? {
              ...reply,
              isLiked: action === 'like',
              likeCount: reply.likeCount + (action === 'like' ? 1 : -1),
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

    onError: (_err, _action, context) => {
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

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ['replies', postId, parentId],
        })
      }
    },
  })
}
