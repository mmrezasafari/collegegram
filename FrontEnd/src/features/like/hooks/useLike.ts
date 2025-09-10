import api from '@/lib/axios'
import type { ISuccessRes } from '@/types/error'
import type { IGetPostRes } from '@/types/posts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export async function toggleLikePost(
  postId: string,
  action: 'like' | 'unlike',
): Promise<ISuccessRes> {
  if (action === 'like') {
    const res = await api.post<ISuccessRes>(`posts/${postId}/like`)
    return res.data
  } else {
    const res = await api.delete<ISuccessRes>(`posts/${postId}/unlike`)
    return res.data
  }
}

export function useToggleLike(postId: string) {
  const queryClient = useQueryClient()

  return useMutation<ISuccessRes, Error, 'like' | 'unlike'>({
    mutationKey: ['post', postId, 'like'],
    mutationFn: (action) => toggleLikePost(postId, action),
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] })
      const previous = queryClient.getQueryData<IGetPostRes>(['post', postId])

      queryClient.setQueryData<IGetPostRes>(['post', postId], (old) =>
        old
          ? {
              ...old,
              data: {
                ...old.data,
                liked: action === 'like' ? true : false,
                likeCount: old.data.likeCount + (action === 'like' ? 1 : -1),
              },
            }
          : old,
      )

      return { previous }
    },
  })
}
