import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type { IUploadedPostsRes, IUploadPosts } from '@/types/posts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export async function uploadPosts(
  value: IUploadPosts,
): Promise<IUploadedPostsRes> {
  const formData = new FormData()
  formData.append('caption', value.caption)

  value.images.forEach((file) => {
    formData.append('images', file)
  })

  const res = await api.post<IUploadedPostsRes>('/profile/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data
}

export function useUploadPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['uploadedPost'],
    mutationFn: uploadPosts,
    onSuccess: () => {
      // change with profile get posts
      queryClient.invalidateQueries({ queryKey: ['me'] })
      notify.success('پست با موفقیت بارگذاری شد', {
        position: 'top-right',
        duration: 10000,
      })
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        notify.error(err.response?.data?.message, {
          position: 'top-right',
          duration: 10000,
        })
      }
    },
  })
}
