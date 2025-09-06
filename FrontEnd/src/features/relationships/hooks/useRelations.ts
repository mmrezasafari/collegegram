import { useMe } from '@/features/common/hooks/users/useGetMe'
import { useGetUserName } from '@/features/common/hooks/users/useGetUserName'
import api from '@/lib/axios'
import type {
  IFollowersListRes,
  IFollowingsListRes,
  IFollowRes,
  IUnfollowRes,
} from '@/types/relations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export async function getFollowers(
  userName: string,
): Promise<IFollowersListRes> {
  const res = await api.get<IFollowersListRes>(`users/${userName}/followers`)

  return res.data
}

export async function getFollowings(
  userName: string,
): Promise<IFollowingsListRes> {
  const res = await api.get<IFollowingsListRes>(`users/${userName}/followings`)

  return res.data
}

export async function followAction(userName: string): Promise<IFollowRes> {
  const res = await api.post(`users/${userName}/follow`)

  return res.data
}

export async function unfollowAction(userName: string): Promise<IUnfollowRes> {
  const res = await api.delete(`users/${userName}/unfollow`)

  return res.data
}

export function useGetFollowers() {
  const userName = useGetUserName()

  return useQuery({
    queryKey: ['followersList', userName],
    queryFn: async () => {
      if (!userName) throw new Error('Username is not available yet!')
      return getFollowers(userName)
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export function useGetFollowings() {
  const userName = useGetUserName()

  return useQuery({
    queryKey: ['followingsList', userName],
    queryFn: async () => {
      if (!userName) throw new Error('Username is not available yet!')
      return getFollowings(userName)
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export function useFollowAction() {
  const queryClient = useQueryClient()
  const userName = useGetUserName()
  const { data: me } = useMe()

  return useMutation({
    mutationKey: ['follow', userName],
    mutationFn: async () => {
      if (!userName) throw new Error('Username is not available yet!')
      return followAction(userName)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userName] })
      queryClient.invalidateQueries({
        queryKey: ['followingsList', me?.data.username],
      })
      queryClient.invalidateQueries({ queryKey: ['followersList', userName] })
    },
  })
}

export function useUnfollowAction() {
  const queryClient = useQueryClient()
  const userName = useGetUserName()
  const { data: me } = useMe()

  return useMutation({
    mutationKey: ['unfollow', userName],
    mutationFn: async () => {
      if (!userName) throw new Error('Username is not available yet!')
      return unfollowAction(userName)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userName] })
      queryClient.invalidateQueries({
        queryKey: ['followingsList', me?.data.username],
      })
      queryClient.invalidateQueries({ queryKey: ['followersList', userName] })
    },
  })
}
