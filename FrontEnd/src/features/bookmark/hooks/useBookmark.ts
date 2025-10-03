import api from '@/lib/axios'
import type { IErrorRes, ISuccessRes } from '@/types/error'
import type { IExploreGetRes } from '@/types/explore'
import type { IGetPostRes } from '@/types/posts'
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

type TMutationVars = 'save' | 'unsave'
interface IMutationContext {
  previousPostDetails?: IGetPostRes
  previousExploreData?: InfiniteData<IExploreGetRes>
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

  return useMutation<
    ISuccessRes,
    AxiosError<IErrorRes>,
    TMutationVars,
    IMutationContext
  >({
    mutationKey: ['post', postId, 'bookmark'],
    mutationFn: (action) => toggleSavePost(postId, action),

    onMutate: async (action) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['post', postId] }),
        queryClient.cancelQueries({ queryKey: ['explore-posts'] }),
      ])

      const previousPostDetails = queryClient.getQueryData<IGetPostRes>([
        'post',
        postId,
      ])
      const previousExploreData = queryClient.getQueryData<
        InfiniteData<IExploreGetRes>
      >(['explore-posts'])

      // Optimistic update: post detail
      if (previousPostDetails) {
        queryClient.setQueryData<IGetPostRes>(['post', postId], (old) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  saved: action === 'save',
                  saveCount: old.data.saveCount + (action === 'save' ? 1 : -1),
                },
              }
            : old,
        )
      }

      // Optimistic update: explore feed
      if (previousExploreData) {
        queryClient.setQueryData<InfiniteData<IExploreGetRes>>(
          ['explore-posts'],
          (old) =>
            old
              ? {
                  ...old,
                  pages: old.pages.map((page) => ({
                    ...page,
                    data: page.data.map((item) =>
                      item.post.id === postId
                        ? {
                            ...item,
                            isSaved: action === 'save',
                            savedCount:
                              item.savedCount + (action === 'save' ? 1 : -1),
                          }
                        : item,
                    ),
                  })),
                }
              : old,
        )
      }

      return { previousPostDetails, previousExploreData }
    },

    onError: (_err, _action, context) => {
      if (context?.previousPostDetails) {
        queryClient.setQueryData(['post', postId], context.previousPostDetails)
      }
      if (context?.previousExploreData) {
        queryClient.setQueryData(['explore-posts'], context.previousExploreData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] })
    },
  })
}
