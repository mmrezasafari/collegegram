import type { IRegisteredUser } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getMe } from './useGetMe'

export function useGetUserName() {
  const params = useParams()

  const { data: me } = useQuery<IRegisteredUser>({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: Infinity,
  })

  return params.username || me?.data.username
}
