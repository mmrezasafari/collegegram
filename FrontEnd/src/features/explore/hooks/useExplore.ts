import api from '@/lib/axios'
import type { IExploreGetRes } from '@/types/explore'
import { useQuery } from '@tanstack/react-query'

export async function fetchExploreDate(
  offset: number,
  limit: number,
  order: string,
): Promise<IExploreGetRes> {
  const res = await api.get(
    `/profile/home-page?offset=${offset}&limit=${limit}&sort=${order}`,
  )

  return res.data
}

export function useExplore(offset: number, limit: number, order: string) {
  return useQuery<IExploreGetRes, Error>({
    queryKey: ['explore'],
    queryFn: () => fetchExploreDate(offset, limit, order),
  })
}
