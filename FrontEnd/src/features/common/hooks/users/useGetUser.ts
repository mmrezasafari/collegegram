import api from '@/lib/axios'
import type { IRegisteredUser } from '@/types/user'
import { useGetUserName } from './useGetUserName'
import { useQuery } from '@tanstack/react-query'
import { useMe } from './useGetMe'

export async function getUser(userName: string): Promise<IRegisteredUser> {
  const res = await api.get<IRegisteredUser>(`/users/${userName}`)

  return res.data
}

export function useGetUser(userName?: string) {
  const { data: me } = useMe()
  const paramUserName = useGetUserName()
  const mainUserName = userName || paramUserName

  const canFetch = !!mainUserName && me?.data.username !== mainUserName

  return useQuery<IRegisteredUser>({
    queryKey: ['user', mainUserName],
    queryFn: () => getUser(mainUserName as string),
    staleTime: 5 * 60 * 1000,
    enabled: canFetch,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}
