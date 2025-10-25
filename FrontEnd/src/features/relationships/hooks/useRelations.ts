import api from '@/lib/axios'
import type {
  IBlockListRes,
  ICloseFriendsListRes,
  IFollowersListRes,
  IFollowingsListRes,
  IStatusRes,
} from '@/types/relations'
import { useQuery } from '@tanstack/react-query'

// API functions
export async function getFollowers(
  userName: string,
): Promise<IFollowersListRes> {
  const res = await api.get(`users/${userName}/followers`)
  return res.data
}

export async function getFollowings(
  userName: string,
): Promise<IFollowingsListRes> {
  const res = await api.get(`users/${userName}/followings`)
  return res.data
}

export async function getCloseFriends(): Promise<ICloseFriendsListRes> {
  const res = await api.get('users/me/close-friends')
  return res.data
}

export async function getBlockList(): Promise<IBlockListRes> {
  const res = await api.get('users/me/block')
  return res.data
}

export async function relationStatus(userName: string): Promise<IStatusRes> {
  const res = await api.get(`users/${userName}/status`)
  return res.data
}

export function useGetFollowers(userName: string) {
  return useQuery<IFollowersListRes>({
    queryKey: ['followersList', userName],
    queryFn: () => getFollowers(userName),
    staleTime: 5 * 60 * 1000,
    enabled: !!userName,
    refetchOnWindowFocus: false,
  })
}

export function useGetFollowings(userName: string) {
  return useQuery<IFollowingsListRes>({
    queryKey: ['followingsList', userName],
    queryFn: () => getFollowings(userName),
    staleTime: 5 * 60 * 1000,
    enabled: !!userName,
    refetchOnWindowFocus: false,
  })
}

export function useGetCloseFriends() {
  return useQuery<ICloseFriendsListRes>({
    queryKey: ['closeFriendsList'],
    queryFn: getCloseFriends,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useGetBlockList() {
  return useQuery<IBlockListRes>({
    queryKey: ['blockList'],
    queryFn: getBlockList,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useGetRelationStatus(
  userName: string,
  options?: { enabled?: boolean },
) {
  return useQuery<IStatusRes>({
    queryKey: ['relation-status', userName],
    queryFn: () => relationStatus(userName),
    staleTime: 5 * 60 * 1000,
    enabled: !!userName && options?.enabled,
    refetchOnWindowFocus: false,
  })
}
