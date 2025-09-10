import { notify } from '@/features/common/components/ui/sonner'
import { useGetUserName } from '@/features/common/hooks/users/useGetUserName'
import api from '@/lib/axios'
import type {
  IGetPostRes,
  IPostsRes,
  IUploadedPostsRes,
  IUploadPosts,
} from '@/types/posts'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

export async function uploadPosts(
  value: IUploadPosts,
): Promise<IUploadedPostsRes> {
  const formData = new FormData()

  formData.append('caption', value.caption)
  value.images.forEach((file) => {
    formData.append('images', file)
  })
  formData.append('mention', value.mention)

  const res = await api.post<IUploadedPostsRes>('/profile/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data
}

export async function getPosts(userName: string): Promise<IPostsRes> {
  const res = await api.get<IPostsRes>(`/users/${userName}/posts`)

  return res.data
}

export async function getPost(postId: string): Promise<IGetPostRes> {
  const res = await api.get<IGetPostRes>(`/posts/${postId}`)

  return res.data
}

export function useGetPosts() {
  const userName = useGetUserName()

  return useQuery({
    queryKey: ['posts', userName],
    queryFn: async () => {
      if (!userName) throw new Error('Username is not available yet!')
      return getPosts(userName)
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}

export function useUploadPost() {
  const queryClient = useQueryClient()
  const userName = useGetUserName()

  return useMutation({
    mutationKey: ['uploadedPost'],
    mutationFn: uploadPosts,
    onSuccess: () => {
      // change with profile get posts
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['posts', userName] })
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

export function useGetPost(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) throw new Error('Username is not available yet!')
      return getPost(postId)
    },
    enabled: !!postId,
  })
}
