import api from '@/lib/axios'
import type { IRegisteredUser } from '@/types/user'
import { useQuery, useQueryClient } from '@tanstack/react-query'

async function getUserInfo(userid: string): Promise<IRegisteredUser> {
  const data = await api
    .get<IRegisteredUser>(`/users/${userid}`)
    .then((response) => response.data)

  return data
}

export function useGetUser(userid: string) {
  //   const queryclient = useQueryClient()
  const getUserQuery = useQuery({
    queryKey: ['user', userid],
    queryFn: () => getUserInfo(userid),
  })

  return getUserQuery
}
