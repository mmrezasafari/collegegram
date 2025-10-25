import api from '@/lib/axios'
import type { IExplore, IExploreGetRes } from '@/types/explore'
import type { IErrorRes } from '@/types/error'
import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryFunctionContext,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

interface IExplorePostsPage {
  data: IExploreGetRes
  nextOffset?: number
}

export async function fetchExplorePosts({
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
    InfiniteData<IExplorePostsPage>,
    ['explore-posts'],
    number
  >({
    queryKey: ['explore-posts'],
    queryFn: fetchExplorePosts,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const allPosts: IExplore[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allPosts }
}
