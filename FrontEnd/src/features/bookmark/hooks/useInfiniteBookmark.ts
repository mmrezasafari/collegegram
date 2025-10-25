import api from '@/lib/axios'
import type { IErrorRes } from '@/types/error'
import type { ISaved, ISavedGetRes } from '@/types/seved'
import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryFunctionContext,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

interface ISavedPostsPage {
  data: ISavedGetRes
  nextOffset?: number
}

export async function fetchSavedPosts({
  pageParam = 0,
}: QueryFunctionContext): Promise<ISavedPostsPage> {
  const limit = 10
  const { data } = await api.get<ISavedGetRes>(
    `/profile/saved-page?offset=${pageParam}&limit=${limit}&sort=ASC`,
  )

  return {
    data,
    nextOffset:
      data.data.length === limit ? (pageParam as number) + limit : undefined,
  }
}

export function useInfiniteSavedPosts() {
  const query = useInfiniteQuery<
    ISavedPostsPage,
    AxiosError<IErrorRes>,
    InfiniteData<ISavedPostsPage>,
    ['saved-posts'],
    number
  >({
    queryKey: ['saved-posts'],
    queryFn: fetchSavedPosts,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const allPosts: ISaved[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allPosts }
}
