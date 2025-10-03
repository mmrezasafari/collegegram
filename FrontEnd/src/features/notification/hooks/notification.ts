import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
  type QueryFunctionContext,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import api from '@/lib/axios'
import type {
  INotification,
  INotificationRes,
  IUnreadCountRes,
} from '@/types/notification'
import type { IErrorRes } from '@/types/error'

interface INotificationPage {
  data: INotificationRes
  nextOffset?: number
}

const LIMIT = 10

export async function getMyNotifications({
  pageParam = 0,
}: QueryFunctionContext): Promise<INotificationPage> {
  const { data } = await api.get<INotificationRes>(
    `/notifications/me?offset=${pageParam}&limit=${LIMIT}`,
  )

  return {
    data,
    nextOffset:
      data.data.length === LIMIT ? (pageParam as number) + LIMIT : undefined,
  }
}

export async function getFriendsNotifications({
  pageParam = 0,
}: QueryFunctionContext): Promise<INotificationPage> {
  const { data } = await api.get(
    `/notifications/friends?offset=${pageParam}&limit=${LIMIT}`,
  )

  return {
    data,
    nextOffset:
      data.data.length === LIMIT ? (pageParam as number) + LIMIT : undefined,
  }
}

export async function getUnreadCount(): Promise<IUnreadCountRes> {
  const res = await api.get(`/notifications/unread-count`)
  return res.data
}

export function useInfiniteMyNotifications() {
  const query = useInfiniteQuery<
    INotificationPage,
    AxiosError<IErrorRes>,
    InfiniteData<INotificationPage>,
    ['notifications', 'me', 'infinite'],
    number
  >({
    queryKey: ['notifications', 'me', 'infinite'],
    queryFn: getMyNotifications,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const allMyNotifications: INotification[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allMyNotifications }
}

export function useInfiniteFriendsNotifications() {
  const query = useInfiniteQuery<
    INotificationPage,
    AxiosError,
    InfiniteData<INotificationPage>,
    ['notifications', 'friends', 'infinite'],
    number
  >({
    queryKey: ['notifications', 'friends', 'infinite'],
    queryFn: getFriendsNotifications,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const allMyNotifications: INotification[] =
    query.data?.pages.flatMap((page) => page.data.data) ?? []

  return { ...query, allMyNotifications }
}

export function useUnreadCount() {
  return useQuery<IUnreadCountRes, AxiosError>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    staleTime: 1000 * 60 * 5,
  })
}
