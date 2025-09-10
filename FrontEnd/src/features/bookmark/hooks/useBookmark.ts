import api from '@/lib/axios'
import type { ISuccessRes } from '@/types/error'
import type { IGetPostRes } from '@/types/posts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const toggleSavePost = async (
  postId: string,
  action: 'save' | 'unsave',
): Promise<ISuccessRes> => {
  if (action === 'save') {
    const res = await api.post<ISuccessRes>(`/posts/${postId}/saved-post`)
    return res.data
  } else {
    const res = await api.delete<ISuccessRes>(`/posts/${postId}/unsaved-post`)
    return res.data
  }
}

export function useToggleSavePost(postId: string) {
  const queryClient = useQueryClient()

  return useMutation<ISuccessRes, Error, 'save' | 'unsave'>({
    mutationKey: ['post', postId, 'bookmark'],
    mutationFn: (action) => toggleSavePost(postId, action),
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] })
      const previous = queryClient.getQueryData<IGetPostRes>(['post', postId])

      queryClient.setQueryData<IGetPostRes>(['post', postId], (old) =>
        old
          ? {
              ...old,
              data: {
                ...old.data,
                saved: action === 'save' ? true : false,
                saveCount: old.data.saveCount + (action === 'save' ? 1 : -1),
              },
            }
          : old,
      )

      return { previous }
    },
  })
}
