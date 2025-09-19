import api from '@/lib/axios'
import type {
  ISearchUserDataGetRes,
  ISearchKeywordDataGetRes,
  ISearchSuggestionDataGetRes,
} from '@/types/search'
import { useQuery } from '@tanstack/react-query'

export async function fetchSearchDate(
  offset: number,
  limit: number,
  order: string,
): Promise<
  | ISearchUserDataGetRes
  | ISearchKeywordDataGetRes
  | ISearchSuggestionDataGetRes
  | undefined
> {
  const res = await api.get(
    `/profile/search-page?offset=${offset}&limit=${limit}&sort=${order}`,
  )

  return res.data
}

export function useSearch(offset: number, limit: number, order: string) {
  return useQuery<
    | ISearchUserDataGetRes
    | ISearchKeywordDataGetRes
    | ISearchSuggestionDataGetRes
    | undefined,
    Error
  >({
    queryKey: ['search'],
    queryFn: () => fetchSearchDate(offset, limit, order),
  })
}
