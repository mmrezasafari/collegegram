import api from '@/lib/axios'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { notify } from '../../components/ui/sonner'
import type { IRegisteredUser } from '@/types/user'
import { useEffect } from 'react'

export async function getMe(): Promise<IRegisteredUser> {
  const res = await api.get<IRegisteredUser>('/profile/me')

  return res.data
}

export function useMe() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const query = useQuery<IRegisteredUser, Error>({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (
      query.error instanceof AxiosError &&
      query.error.response?.status === 401
    ) {
      queryClient.removeQueries({ queryKey: ['me'] })
      queryClient.removeQueries({ queryKey: ['loginUser'] })
      queryClient.removeQueries({ queryKey: ['registerUser'] })

      notify.error('ابتدا وارد شوید', {
        position: 'top-right',
        duration: 5000,
      })

      navigate('/', { replace: true })
    }
  }, [query.error, queryClient, navigate])

  return query
}
