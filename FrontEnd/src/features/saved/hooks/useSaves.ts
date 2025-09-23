import api from '@/lib/axios'
import type { IErrorRes } from '@/types/error'
import type { ISaved, ISavedGetRes } from '@/types/seved'
import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

interface ISavedPostsPage {
  data: ISavedGetRes
  nextOffset?: number
}

async function fetchSavedPosts({
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
    ISavedPostsPage,
    ['saved-posts'],
    number
  >({
    queryKey: ['saved-posts'],
    queryFn: fetchSavedPosts,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const allPosts: ISaved[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allPosts }
}
