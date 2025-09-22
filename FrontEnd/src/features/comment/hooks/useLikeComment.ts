import api from '@/lib/axios'
import type { ICommentRes } from '@/types/comment'
import type { IErrorRes, ISuccessRes } from '@/types/error'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

type TMutationVar = 'like' | 'unlike'

export async function toggleLikeComment(
  commentId: string,
  action: TMutationVar,
): Promise<ISuccessRes> {
  if (action === 'like') {
    const res = await api.post<ISuccessRes>(`/comments/${commentId}/like`)
    return res.data
  } else {
    const res = await api.post<ISuccessRes>(`/comments/${commentId}/unlike`)
    return res.data
  }
}

export function useToggleLikeComment(postId: string, commentId: string) {
  const queryClient = useQueryClient()

  return useMutation<ISuccessRes, AxiosError<IErrorRes>, TMutationVar>({
    mutationKey: ['comment', commentId, 'like'],
    mutationFn: (action) => toggleLikeComment(commentId, action),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })
      const previousComments = await queryClient.getQueryData([
        'comments',
        postId,
      ])

      if (previousComments) {
        queryClient.setQueryData<ICommentRes>(['comments', postId], (old) => {
          console.log(old)
        })
      }
    },
  })
}
