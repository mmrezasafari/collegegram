import { useGetUser } from '@/features/common/hooks/users/useGetUser'
import { useGetUserName } from '@/features/common/hooks/users/useGetUserName'
import api from '@/lib/axios'
import type { IGetPostRes, IPostsRes } from '@/types/posts'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

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
  const { data: user } = useGetUser(userName!)
  const isMyProfile = user?.data.username === undefined

  const canFetch =
    isMyProfile ||
    user?.data.isPrivate === false ||
    (user?.data.isPrivate === true && user.data.isFollowing === true)

  return useQuery<IPostsRes>({
    queryKey: ['posts', userName],
    queryFn: () => getPosts(userName!),
    enabled: !!userName && canFetch,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useGetPost(postId: string) {
  return useQuery<IGetPostRes>({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
