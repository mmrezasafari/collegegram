import api from '@/lib/axios'
import type { IErrorRes } from '@/types/error'
import type {
  ISearchUserGetRes,
  ISearchTagsData,
  ISearchedUsersData,
} from '@/types/search'
import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

interface ISearchUsersPage {
  data: ISearchedUsersData
  nextOffset?: number
}

interface ISearchTagsPage {
  data: ISearchTagsData
  nextOffset?: number
}

// Fetch Users Data
async function fetchSearchUsersData({
  pageParam = 0,
  query = '',
}: QueryFunctionContext & { query?: string }): Promise<ISearchUsersPage> {
  const limit = 10
  const { data } = await api.get<ISearchUserGetRes>(
    `search/users?offset=${pageParam}&limit=${limit}&sort=ASC&search=${query}&isSummary=false`,
  )

  return {
    data: data.data,
    nextOffset:
      data.data.length === limit ? (pageParam as number) + limit : undefined,
  }
}

export function useInfiniteSearch() {
  const query = useInfiniteQuery<
    ISearchUsersPage,
    AxiosError<IErrorRes>,
    ISearchUsersPage,
    ['search'],
    number
  >({
    queryKey: ['search'],
    queryFn: fetchSearchUsersData,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
  })

  const allUsers: ISearchedUsersData[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allUsers }
}

// Fetch Tagged Data
async function fetchSearchTagsData({
  pageParam = 0,
  query = '',
}: QueryFunctionContext & { query?: string }): Promise<ISearchTagsPage> {
  const limit = 10
  const { data } = await api.get<ISearchTagsData>(
    `search/tags?offset=${pageParam}&limit=${limit}&sort=ASC&search=${query}&isSummary=false`,
  )
  return {
    data: data,
    nextOffset:
      data.data.length === limit ? (pageParam as number) + limit : undefined,
  }
}

export function useInfiniteTagSearch() {
  const query = useInfiniteQuery<
    ISearchTagsPage,
    AxiosError<IErrorRes>,
    ISearchTagsPage,
    ['search'],
    number
  >({
    queryKey: ['search'],
    queryFn: fetchSearchTagsData,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
  })

  const allTags: ISearchTagsData[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allTags }
}
