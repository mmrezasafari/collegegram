import api from '@/lib/axios'
import type { ITagGetRes } from '@/types/tagged'
import { useQuery } from '@tanstack/react-query'

export async function fetchTaggedDate(
  offset: number,
  limit: number,
  order: string,
): Promise<ITagGetRes> {
  const res = await api.get(
    `/profile/mention-page?offset=${offset}&limit=${limit}&sort=${order}`,
  )

  return res.data
}

export function useTagged(offset: number, limit: number, order: string) {
  return useQuery<ITagGetRes, Error>({
    queryKey: ['tagged'],
    queryFn: () => fetchTaggedDate(offset, limit, order),
  })
}
