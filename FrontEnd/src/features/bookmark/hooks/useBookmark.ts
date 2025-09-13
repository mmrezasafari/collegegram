import api from '@/lib/axios'
import type { IErrorRes, ISuccessRes } from '@/types/error'
import type { IExploreGetRes } from '@/types/explore'
import type { IGetPostRes } from '@/types/posts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

type TMutationVars = 'save' | 'unsave'
interface IMutationContext {
  previousPostDetails?: IGetPostRes
  previousExploreData?: IExploreGetRes
}

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

  return useMutation<ISuccessRes, AxiosError<IErrorRes>, TMutationVars, IMutationContext>({
    mutationKey: ['post', postId, 'bookmark'],
    mutationFn: (action) => toggleSavePost(postId, action),

    onMutate: async (context) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] })
      const previousPostDetails = queryClient.getQueryData<IGetPostRes>(['post', postId])
      const previousExploreData = queryClient.getQueryData<IExploreGetRes>(['explore'])

      if (previousPostDetails) {
        queryClient.setQueryData<IGetPostRes>(['post', postId], (old) => {
          if (!old) return old

          return {
            ...old,
            data: {
              ...old.data,
              saved: context === 'save' ? true : false,
              saveCount: old.data.saveCount + (context === 'save' ? 1 : -1),
            },
          }
        })
      }

      if (previousExploreData) {
        queryClient.setQueryData<IExploreGetRes>(['explore'], (old) => {
          if (!old) return old

          return {
            ...old,
            data: old?.data.map((data) =>
              postId === data.post.id
                ? {
                  ...data,
                  isSaved: context === 'save',
                  savedCount: data.likeCount + (context === 'save' ? 1 : -1)
                }
                : data
            )
          }
        })
      }

      return { previousPostDetails, previousExploreData, action: context }
    },
    onError(_err, _var, context) {
      if (context?.previousPostDetails) {
        queryClient.setQueryData(['post', postId], context.previousPostDetails)
      }
      if (context?.previousExploreData) {
        queryClient.setQueryData(['explore'], context.previousExploreData)
      }
    }
  })
}
