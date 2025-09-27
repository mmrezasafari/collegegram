import api from '@/lib/axios'
import type { IErrorRes } from '@/types/error'
import type { ITagged, ITagGetRes } from '@/types/tagged'
import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryFunctionContext,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

interface ITaggedPostsPage {
  data: ITagGetRes
  nextOffset?: number
}

export async function fetchTaggedPosts({
  pageParam = 0,
}: QueryFunctionContext): Promise<ITaggedPostsPage> {
  const limit = 10
  const { data } = await api.get<ITagGetRes>(
    `/profile/mentioned-page?offset=${pageParam}&limit=${limit}&sort=ASC`,
  )

  return {
    data,
    nextOffset:
      data.data.length === limit ? (pageParam as number) + limit : undefined,
  }
}

export function useInfiniteTagged() {
  const query = useInfiniteQuery<
    ITaggedPostsPage,
    AxiosError<IErrorRes>,
    InfiniteData<ITaggedPostsPage>,
    ['tagged-posts'],
    number
  >({
    queryKey: ['tagged-posts'],
    queryFn: fetchTaggedPosts,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const allPosts: ITagged[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allPosts }
}
