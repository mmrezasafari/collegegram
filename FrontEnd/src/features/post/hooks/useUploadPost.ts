import { notify } from '@/features/common/components/ui/sonner'
import { useGetUserName } from '@/features/common/hooks/users/useGetUserName'
import api from '@/lib/axios'
import type { IErrorRes } from '@/types/error'
import type { IUploadedPostsRes, IUploadPosts } from '@/types/posts'
import type { IRegisteredUser } from '@/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

interface MutationContext {
  previousMeDetails?: IRegisteredUser
}

export async function uploadPosts(
  value: IUploadPosts,
): Promise<IUploadedPostsRes> {
  const formData = new FormData()

  formData.append('caption', value.caption)
  value.images.forEach((file) => {
    formData.append('images', file)
  })
  formData.append('mention', value.mention)
  formData.append(
    'onlyCloseFriends',
    value.onlyCloseFriends === true ? 'true' : 'false',
  )

  const res = await api.post<IUploadedPostsRes>('/profile/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data
}

export function useUploadPost() {
  const queryClient = useQueryClient()
  const userName = useGetUserName()

  return useMutation<
    IUploadedPostsRes,
    AxiosError<IErrorRes>,
    IUploadPosts,
    MutationContext
  >({
    mutationKey: ['posts', userName, 'upload'],
    mutationFn: (data) => uploadPosts(data),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['me'] })

      const previousMeDetails = queryClient.getQueryData<IRegisteredUser>([
        'me',
      ])

      queryClient.setQueryData<IRegisteredUser>(['me'], (old) =>
        old
          ? {
            ...old,
            data: {
              ...old.data,
              postCount: (old.data.postCount ?? 0) + 1,
            },
          }
          : old,
      )

      return { previousMeDetails }
    },

    onError: (error, _vars, context) => {
      if (context?.previousMeDetails) {
        queryClient.setQueryData(['me'], context.previousMeDetails)
      }

      notify.error(error.response?.data?.message ?? 'خطا در بارگذاری پست', {
        position: 'top-right',
        duration: 10000,
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userName] })

      notify.success('پست با موفقیت بارگذاری شد', {
        position: 'top-right',
        duration: 10000,
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
