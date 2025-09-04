import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type { IPostsRes, IUploadedPostsRes, IUploadPosts } from '@/types/posts'
import type { IRegisteredUser } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useParams } from 'react-router-dom'

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

export async function getPosts(userName: string): Promise<IPostsRes> {
  const res = await api.get<IPostsRes>(`/users/${userName}/posts`)

  return res.data
}

export function usegetPosts() {
  const querClient = useQueryClient()
  const params = useParams()
  const catchedUser = querClient.getQueryData<IRegisteredUser>(['me'])

  const effectiveUsername = params.username || catchedUser?.data.username

  return useQuery({
    queryKey: ['posts', effectiveUsername],
    queryFn: async () => {
      if (!effectiveUsername) throw new Error('Username is not available yet!')
      return getPosts(effectiveUsername)
    },
    enabled: !!effectiveUsername // run if userName exists
  })
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
