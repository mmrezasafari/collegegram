import api from '@/lib/axios'
import type { ISavedGetRes } from '@/types/seved'
import { useQuery } from '@tanstack/react-query'

export async function fetchSavesDate(
  offset: number,
  limit: number,
  order: string,
): Promise<ISavedGetRes> {
  const res = await api.get(
    `/profile/saved-page?offset=${offset}&limit=${limit}&sort=${order}`,
  )

  return res.data
}

export function useSaves(offset: number, limit: number, order: string) {
  return useQuery<ISavedGetRes, Error>({
    queryKey: ['saves'],
    queryFn: () => fetchSavesDate(offset, limit, order),
  })
}
