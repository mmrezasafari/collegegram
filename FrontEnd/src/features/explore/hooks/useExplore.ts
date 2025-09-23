import api from '@/lib/axios'
import type { IErrorRes } from '@/types/error'
import type { IExplore, IExploreGetRes } from '@/types/explore'
import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

interface IExplorePostsPage {
  data: IExploreGetRes
  nextOffset?: number
}

async function fetchSavedPosts({
  pageParam = 0,
}: QueryFunctionContext): Promise<IExplorePostsPage> {
  const limit = 10
  const { data } = await api.get<IExploreGetRes>(
    `/profile/home-page?offset=${pageParam}&limit=${limit}&sort=ASC`,
  )

  return {
    data,
    nextOffset:
      data.data.length === limit ? (pageParam as number) + limit : undefined,
  }
}

export function useInfiniteExplore() {
  const query = useInfiniteQuery<
    IExplorePostsPage,
    AxiosError<IErrorRes>,
    IExplorePostsPage,
    ['saved-posts'],
    number
  >({
    queryKey: ['saved-posts'],
    queryFn: fetchSavedPosts,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  })

  const allPosts: IExplore[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allPosts }
}
