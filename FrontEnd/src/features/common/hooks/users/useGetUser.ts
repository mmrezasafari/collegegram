import api from '@/lib/axios'
import type { IRegisteredUser } from '@/types/user'
import { useGetUserName } from './useGetUserName'
import { useQuery } from '@tanstack/react-query'

export async function getUser(userName: string): Promise<IRegisteredUser> {
  const res = await api.get<IRegisteredUser>(`/users/${userName}`)

  return res.data
}

export function useGetUser(userName?: string) {
  const paramUserName = useGetUserName()
  const mainUserName = userName || paramUserName

  return useQuery({
    queryKey: ['user', mainUserName],
    queryFn: () => getUser(mainUserName as string),
    staleTime: 5 * 60 * 1000,
    enabled: !!mainUserName,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
