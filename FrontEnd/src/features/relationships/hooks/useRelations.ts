import api from '@/lib/axios'
import type {
  ICloseFriendsListRes,
  IFollowersListRes,
  IFollowingsListRes,
  IStatusRes,
} from '@/types/relations'
import { useQuery } from '@tanstack/react-query'

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

export async function getCloseFriends(): Promise<ICloseFriendsListRes> {
  const res = await api.get<ICloseFriendsListRes>('users/me/close-friends')
  return res.data
}

export async function relationStatus(userName: string): Promise<IStatusRes> {
  const res = await api.get(`users/${userName}/status`)
  return res.data
}

export function useGetFollowers(userName: string) {
  return useQuery({
    queryKey: ['followersList', userName],
    queryFn: async () => getFollowers(userName),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export function useGetFollowings(userName: string) {
  return useQuery({
    queryKey: ['followingsList', userName],
    queryFn: async () => getFollowings(userName),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export function useGetCloseFriends() {
  return useQuery({
    queryKey: ['closeFriendsList'],
    queryFn: getCloseFriends,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export function useGetRelationStatus(userName: string) {
  return useQuery({
    queryKey: ['relation-status', userName],
    queryFn: () => relationStatus(userName),
    staleTime: 1000 * 60 * 5,
    enabled: !!userName,
    refetchOnWindowFocus: false,
  })
}
