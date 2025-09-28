import api from '@/lib/axios'
import type { IRegisteredUser } from '@/types/user'
import { useGetUserName } from './useGetUserName'
import { useQuery } from '@tanstack/react-query'

export async function getUser(userName: string): Promise<IRegisteredUser> {
  const res = await api.get<IRegisteredUser>(`/users/${userName}`)

  return res.data
}

export function useGetUser() {
  const userName = useGetUserName()

  return useQuery({
    queryKey: ['user', userName],
    queryFn: () => getUser(userName as string),
    staleTime: 5 * 60 * 1000,
    enabled: !!userName,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
