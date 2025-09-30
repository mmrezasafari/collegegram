import { useMe } from '@/features/common/hooks/users/useGetMe'
import api from '@/lib/axios'
import type {
  IFollowersListRes,
  IFollowingsListRes,
  IFollowRes,
  IUnfollowRes,
} from '@/types/relations'
import type { IRegisteredUser } from '@/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export async function followAction(userName: string): Promise<IFollowRes> {
  const res = await api.post(`users/${userName}/follow`)
  return res.data
}

export async function unfollowAction(userName: string): Promise<IUnfollowRes> {
  const res = await api.delete(`users/${userName}/unfollow`)
  return res.data
}

export function useFollowAction(userName: string) {
  const queryClient = useQueryClient()
  const { data: me } = useMe()

  const mutation = useMutation({
    mutationKey: ['follow', userName],
    mutationFn: async () => {
      if (!userName) throw new Error('Username is not available yet!')
      return followAction(userName)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', userName] })
      await queryClient.cancelQueries({ queryKey: ['me'] })
      await queryClient.cancelQueries({ queryKey: ['followersList', userName] })
      await queryClient.cancelQueries({
        queryKey: ['followingsList', me?.data.username],
      })

      const previousUser = queryClient.getQueryData<IRegisteredUser>([
        'user',
        userName,
      ])
      const previousMe = queryClient.getQueryData<IRegisteredUser>(['me'])
      const previousFollowers = queryClient.getQueryData<IFollowersListRes>([
        'followersList',
        userName,
      ])
      const previousFollowings = queryClient.getQueryData<IFollowingsListRes>([
        'followingsList',
        me?.data.username,
      ])

      // Optimistic update for user
      queryClient.setQueryData<IRegisteredUser>(['user', userName], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            isFollowing: !old.data.isFollowing,
            followerCount: (old.data.followerCount ?? 0) + 1,
          },
        }
      })

      // Optimistic update for me -> just followings count
      queryClient.setQueryData<IRegisteredUser>(['me'], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            followingCount: (old.data.followingCount ?? 0) + 1,
          },
        }
      })

      // Optimistic update for user followers list
      queryClient.setQueryData<IFollowersListRes | undefined>(
        ['followersList', userName],
        (old) => {
          // check old exist
          if (!old || !me?.data) return old

          if (old.data.find((u) => u.username === me.data.username)) return old
          return {
            ...old,
            data: [
              ...old.data,
              {
                id: me.data.id,
                username: me.data.username,
                firstName: me.data.firstName,
                lastName: me.data.lastName,
                imageUrl: me.data.imagePath,
                followerCount: me.data.followerCount,
                followingCount: me.data.followingCount,
                isFollowing: me.data.isFollowing,
                email: me.data.email,
              },
            ],
          }
        },
      )

      // Optimistic update for me followings list
      queryClient.setQueryData<IFollowingsListRes | undefined>(
        ['followingsList', me?.data.username],
        (old) => {
          if (!old || !me?.data) return old

          return {
            ...old,
            data: [
              ...old.data,
              {
                id: me.data.id,
                username: me.data.username,
                firstName: me.data.firstName,
                lastName: me.data.lastName,
                imageUrl: me.data.imagePath,
                followerCount: me.data.followerCount,
                followingCount: me.data.followingCount,
                isFollowing: me.data.isFollowing,
                email: me.data.email,
              },
            ],
          }
        },
      )

      return { previousUser, previousMe, previousFollowers, previousFollowings }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['relation-status', userName],
      })
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUser)
        queryClient.setQueryData(['user', userName], context.previousUser)
      if (context?.previousMe)
        queryClient.setQueryData(['me'], context.previousMe)
      if (context?.previousFollowers)
        queryClient.setQueryData(
          ['followersList', userName],
          context.previousFollowers,
        )
      if (context?.previousFollowings)
        queryClient.setQueryData(
          ['followingsList', me?.data.username],
          context.previousFollowings,
        )
    },
    onSettled: () => {
      if (!userName || !me?.data) return
      queryClient.cancelQueries({
        queryKey: ['user', userName],
      })
      queryClient.cancelQueries({ queryKey: ['me'] })
      queryClient.cancelQueries({
        queryKey: ['followersList', userName],
      })
      queryClient.cancelQueries({
        queryKey: ['followingsList', me?.data.username],
      })
    },
  })

  useEffect(() => {
    if (userName)
      queryClient.prefetchQuery({
        queryKey: ['user', userName],
      })
  }, [userName, queryClient])

  return mutation
}

export function useUnfollowAction(userName: string) {
  const queryClient = useQueryClient()
  const { data: me } = useMe()

  const mutation = useMutation({
    mutationKey: ['unfollow', userName],
    mutationFn: async () => {
      if (!userName) throw new Error('Username is not available yet!')
      return unfollowAction(userName)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', userName] })
      await queryClient.cancelQueries({ queryKey: ['me'] })
      await queryClient.cancelQueries({ queryKey: ['followersList', userName] })
      await queryClient.cancelQueries({
        queryKey: ['followingsList', me?.data.username],
      })

      const previousUser = queryClient.getQueryData<IRegisteredUser>([
        'user',
        userName,
      ])
      const previousMe = queryClient.getQueryData<IRegisteredUser>(['me'])
      const previousFollowers = queryClient.getQueryData<IFollowersListRes>([
        'followersList',
        userName,
      ])
      const previousFollowings = queryClient.getQueryData<IFollowingsListRes>([
        'followingsList',
        me?.data.username,
      ])

      // Optimistic update for user
      queryClient.setQueryData<IRegisteredUser | undefined>(
        ['user', userName],
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              isFollowing: false,
              followerCount: Math.max((old.data.followerCount ?? 1) - 1, 0),
            },
          }
        },
      )

      // Optimistic update for me
      queryClient.setQueryData<IRegisteredUser | undefined>(['me'], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            followingCount: Math.max((old.data.followingCount ?? 1) - 1, 0),
          },
        }
      })

      // Optimistic update for followers list
      queryClient.setQueryData<IFollowersListRes | undefined>(
        ['followersList', userName],
        (old) => {
          if (!old || !me?.data) return old

          return {
            ...old,
            data: old.data.filter((u) => u.username !== me.data.username),
          }
        },
      )

      // Optimistic update for followings list
      queryClient.setQueryData<IFollowingsListRes | undefined>(
        ['followingsList', me?.data.username],
        (old) => {
          if (!old || !me?.data) return old

          return {
            ...old,
            data: old.data.filter((u) => u.username !== userName),
          }
        },
      )
      console.log(previousFollowings)
      return { previousUser, previousMe, previousFollowers, previousFollowings }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['relation-status', userName],
      })
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUser)
        queryClient.setQueryData(['user', userName], context.previousUser)
      if (context?.previousMe)
        queryClient.setQueryData(['me'], context.previousMe)
      if (context?.previousFollowers)
        queryClient.setQueryData(
          ['followersList', userName],
          context.previousFollowers,
        )
      if (context?.previousFollowings)
        queryClient.setQueryData(
          ['followingsList', me?.data.username],
          context.previousFollowings,
        )
    },
    onSettled: () => {
      if (!userName || !me?.data) return
      queryClient.cancelQueries({ queryKey: ['user', userName] })
      queryClient.cancelQueries({ queryKey: ['me'] })
      queryClient.cancelQueries({ queryKey: ['followersList', userName] })
      queryClient.cancelQueries({
        queryKey: ['followingsList', me?.data.username],
      })
    },
  })

  useEffect(() => {
    if (userName) queryClient.prefetchQuery({ queryKey: ['user', userName] })
  }, [userName, queryClient])

  return mutation
}
