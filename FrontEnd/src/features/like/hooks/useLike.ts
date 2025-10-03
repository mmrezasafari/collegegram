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

type TMutationVars = 'like' | 'unlike'
interface IMutationContext {
  previousPostDetails?: IGetPostRes
  previousExploreData?: InfiniteData<IExploreGetRes>
}

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

  return useMutation<
    ISuccessRes,
    AxiosError<IErrorRes>,
    TMutationVars,
    IMutationContext
  >({
    mutationKey: ['post', postId, 'toggleLike'],
    mutationFn: (action) => toggleLikePost(postId, action),

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
                  liked: action === 'like',
                  likeCount: old.data.likeCount + (action === 'like' ? 1 : -1),
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
                            isLiked: action === 'like',
                            likeCount:
                              item.likeCount + (action === 'like' ? 1 : -1),
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
