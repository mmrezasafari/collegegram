import api from '@/lib/axios'
import type { ISearchTagedData, ISearchUserData } from '@/types/search'
import { useQuery } from '@tanstack/react-query'

export async function fetchSearchUsersData(
  offset: number,
  limit: number,
  order: string,
  query: string,
  isSummary: boolean = false,
): Promise<ISearchUserData> {
  const res = await api.get(
    `search/users?offset=${offset}&limit=${limit}&sort=${order}&search=${query}&isSummary=${isSummary}`,
  )

  return res.data
}

export function useUsersSearch(
  offset: number,
  limit: number,
  order: string,
  query: string,
  isSummary: boolean = false,
) {
  return useQuery<ISearchUserData, Error>({
    queryKey: ['search'],
    queryFn: () => fetchSearchUsersData(offset, limit, order, query, isSummary),
  })
}

export async function fetchSearchTagsData(
  offset: number,
  limit: number,
  order: string,
  query: string,
  isSummary: boolean = false,
): Promise<ISearchTagedData> {
  const res = await api.get(
    `search/tags?offset=${offset}&limit=${limit}&sort=${order}&search=${query}&isSummary=${isSummary}`,
  )
  return res.data
}

export function useTagsSearch(
  offset: number,
  limit: number,
  order: string,
  query: string,
  isSummary: boolean = false,
) {
  return useQuery<ISearchTagedData, Error>({
    queryKey: ['search'],
    queryFn: () => fetchSearchTagsData(offset, limit, order, query, isSummary),
  })
}
