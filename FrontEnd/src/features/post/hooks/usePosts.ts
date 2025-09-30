import { useMe } from '@/features/common/hooks/users/useGetMe'
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
  const { data: me } = useMe()
  const isMyProfile = me?.data.username === user?.data.username
  const canFetch =
    isMyProfile ||
    user?.data.isPrivate === false ||
    (user?.data.isPrivate === true && user.data.isFollowing === true)

  return useQuery<IPostsRes, Error>({
    queryKey: ['posts', userName],
    queryFn: async () => getPosts(userName!),
    enabled: !!user && canFetch,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useGetPost(postId: string) {
  return useQuery<IGetPostRes, Error>({
    queryKey: ['post', postId],
    queryFn: async () => getPost(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
