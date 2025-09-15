import api from '@/lib/axios'
import type { ITagGetRes } from '@/types/tagged'
import { useQuery } from '@tanstack/react-query'

export async function fetchSavesDate(
  offset: number,
  limit: number,
  order: string,
): Promise<ITagGetRes> {
  const res = await api.get(
    `/profile/saved-page?offset=${offset}&limit=${limit}&sort=${order}`,
  )

  return res.data
}

export function useSaves(offset: number, limit: number, order: string) {
  return useQuery<ITagGetRes, Error>({
    queryKey: ['saves'],
    queryFn: () => fetchSavesDate(offset, limit, order),
  })
}
