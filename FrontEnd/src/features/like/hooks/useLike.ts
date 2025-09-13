import api from '@/lib/axios'
import type { IErrorRes, ISuccessRes } from '@/types/error'
import type { IExploreGetRes } from '@/types/explore'
import type { IGetPostRes } from '@/types/posts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

type TMutationVars = 'like' | 'unlike'
interface IMutationContext {
  previousPostDetails?: IGetPostRes
  previousExploreData?: IExploreGetRes
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
    mutationKey: ['post', postId, 'like'],
    mutationFn: (action) => toggleLikePost(postId, action),
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] })
      await queryClient.cancelQueries({ queryKey: ['explore'] })
      const previousPostDetails = queryClient.getQueryData<IGetPostRes>([
        'post',
        postId,
      ])
      const previousExploreData = queryClient.getQueryData<IExploreGetRes>([
        'explore',
      ])

      if (previousPostDetails) {
        queryClient.setQueryData<IGetPostRes>(['post', postId], (old) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              liked: action === 'like' ? true : false,
              likeCount: old.data.likeCount + (action === 'like' ? 1 : -1),
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
                    isLiked: action === 'like',
                    likeCount: data.likeCount + (action === 'like' ? 1 : -1),
                  }
                : data,
            ),
          }
        })
      }

      return { previousExploreData, previousPostDetails, acion: action }
    },
    onError(_err, _var, context) {
      if (context?.previousPostDetails) {
        queryClient.setQueryData(['post', postId], context.previousPostDetails)
      }
      if (context?.previousExploreData) {
        console.log(context?.previousExploreData)
        queryClient.setQueryData(['explore'], context.previousExploreData)
      }
    },
  })
}
