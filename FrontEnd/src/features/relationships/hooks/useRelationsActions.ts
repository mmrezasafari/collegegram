import { notify } from '@/features/common/components/ui/sonner'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import { useGetUser } from '@/features/common/hooks/users/useGetUser'
import api from '@/lib/axios'
import type {
  IAddCloseFriendRes,
  IBlockList,
  IBlockListRes,
  IBlockUserRes,
  ICloseFriend,
  ICloseFriendsListRes,
  IFollowersListRes,
  IFollowingsListRes,
  IFollowRes,
  IRemoveFollowerRes,
  IStatusRes,
  IUnblockUserRes,
  IUnfollowRes,
} from '@/types/relations'
import type { IRegisteredUser, IUser } from '@/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

export async function followAction(userName: string): Promise<IFollowRes> {
  const res = await api.post(`users/${userName}/follow`)
  return res.data
}

export async function unfollowAction(userName: string): Promise<IUnfollowRes> {
  const res = await api.delete(`users/${userName}/unfollow`)
  return res.data
}

export async function respond(userName: string): Promise<{ accept: boolean }> {
  const res = await api.post(`users/${userName}/respond`)
  return res.data
}

export async function removeFollower(
  userName: string,
): Promise<IRemoveFollowerRes> {
  const res = await api.delete(`users/${userName}/follower`)
  return res.data
}

export async function addToBlockList(userName: string): Promise<IBlockUserRes> {
  const res = await api.post(`users/${userName}/block`)
  return res.data
}

export async function removeFromBlockList(
  userName: string,
): Promise<IUnblockUserRes> {
  const res = await api.delete(`users/${userName}/unblock`)
  return res.data
}

export async function addToCloseFriend(
  userName: string,
): Promise<IAddCloseFriendRes> {
  const res = await api.post(`users/${userName}/close-friends`)
  return res.data
}

export async function removeFromCloseFriends(
  userName: string,
): Promise<IAddCloseFriendRes> {
  const res = await api.delete(`users/${userName}/close-friends`)
  return res.data
}

export function useRespond(userName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['respond', userName],
    mutationFn: () => respond(userName),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['relation-status', userName],
      })

      const prevStatus = queryClient.getQueryData<IStatusRes>([
        'relation-status',
        userName,
      ])

      queryClient.setQueryData<IStatusRes>(
        ['relation-status', userName],
        (old) => {
          if (!old) return old

          return {
            ...old,
            data: {
              ...old.data,
              status: 'ACCEPTED',
            },
          }
        },
      )

      return { prevStatus }
    },
  })
}

export function useAddToBlockList(user: IUser) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['add-blockList', user?.username],
    mutationFn: () => addToBlockList(user?.username),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['blockList'] })
      await queryClient.cancelQueries({ queryKey: ['user', user?.username] })

      const previousList = queryClient.getQueryData<IBlockListRes>([
        'blockList',
      ])
      const previousUser = queryClient.getQueryData<IUser>([
        'user',
        user?.username,
      ])

      queryClient.setQueryData<IBlockListRes>(['blockList'], (old) => {
        if (!old || !user) return old

        const optimisticFriend: IBlockList = {
          id: user.id,
          username: user.username,
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          imageUrl: user.imagePath ?? '',
          followersCount: user.followerCount ?? 0,
        }

        return {
          ...old,
          data: [...old.data, optimisticFriend],
        }
      })

      queryClient.setQueryData<IRegisteredUser>(
        ['user', user?.username],
        (old) => {
          if (!old || !user) return old

          return {
            ...old,
            data: {
              ...old.data,
              isBlockedByMe: true,
            },
          }
        },
      )

      return { previousList, previousUser }
    },
    onError: (error, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['blockList'], context.previousList)
        queryClient.setQueryData(['user', user?.username], context.previousUser)
      }

      if (error instanceof AxiosError) {
        notify.error(error.response?.data.message, {
          position: 'top-right',
          duration: 10000,
        })
      } else {
        console.error(error)
      }
    },
  })
}

export function useRemoveFromBlockList(user: IUser) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['remove-blockList', user?.username],
    mutationFn: () => removeFromBlockList(user?.username),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['blockList'] })
      await queryClient.cancelQueries({ queryKey: ['user', user?.username] })

      const previousList = queryClient.getQueryData<IBlockListRes>([
        'blockList',
      ])
      const previousUser = queryClient.getQueryData<IUser>([
        'user',
        user?.username,
      ])

      queryClient.setQueryData<IBlockListRes>(['blockList'], (old) => {
        if (!old || !user) return old

        return {
          ...old,
          data: old.data.filter((item) => item.username !== user.username),
        }
      })
      queryClient.setQueryData<IRegisteredUser>(
        ['user', user?.username],
        (old) => {
          if (!old || !user) return old

          return {
            ...old,
            data: {
              ...old.data,
              isBlockedByMe: false,
            },
          }
        },
      )

      return { previousUser, previousList }
    },
    onSuccess: () => {
      notify.success(
        `${user?.firstName || user?.username} با موفقیت از لیست سیاه حذف شد`,
        {
          position: 'top-right',
          duration: 10000,
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', user?.username], context.previousUser)
        queryClient.setQueryData(['blockList'], context.previousList)
      }

      if (error instanceof AxiosError) {
        notify.error(error.response?.data.message, {
          position: 'top-right',
          duration: 10000,
        })
      } else {
        console.error(error)
      }
    },
  })
}

export function useAddToCloseFriends(user: IUser) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['add-closeFriends', user?.username],
    mutationFn: () => addToCloseFriend(user?.username),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['closeFriendsList'] })
      await queryClient.cancelQueries({ queryKey: ['user', user?.username] })

      const previousList = queryClient.getQueryData<ICloseFriendsListRes>([
        'closeFriendsList',
      ])
      const previousUser = queryClient.getQueryData<IUser>([
        'user',
        user?.username,
      ])

      queryClient.setQueryData<ICloseFriendsListRes>(
        ['closeFriendsList'],
        (old) => {
          if (!old || !user) return old

          const optimisticFriend: ICloseFriend = {
            id: user.id,
            username: user.username,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            imageUrl: user.imagePath ?? '',
            followersCount: user.followerCount ?? 0,
          }

          return {
            ...old,
            data: [...old.data, optimisticFriend],
          }
        },
      )

      queryClient.setQueryData<IRegisteredUser>(
        ['user', user?.username],
        (old) => {
          if (!old || !user) return old

          return {
            ...old,
            data: {
              ...old.data,
              isCloseFriend: true,
            },
          }
        },
      )

      return { previousList, previousUser }
    },

    onError: (error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['closeFriendsList'], context.previousList)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', user?.username], context.previousList)
      }

      if (error instanceof AxiosError) {
        notify.error(error.response?.data.message, {
          position: 'top-right',
          duration: 10000,
        })
      } else {
        console.error(error)
      }
    },

    onSuccess: () => {
      notify.success(
        `${user?.firstName || user?.username} با موفقیت به لیست دوستان نزدیک اضافه شد`,
        {
          position: 'top-right',
          duration: 10000,
        },
      )
    },
  })
}

export function useRemoveFromCloseFriends(user: IUser) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['remove-closeFriends', user?.username],
    mutationFn: () => removeFromCloseFriends(user?.username),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['closeFriendsList'] })
      await queryClient.cancelQueries({ queryKey: ['user', user?.username] })

      const previousList = queryClient.getQueryData<ICloseFriendsListRes>([
        'closeFriendsList',
      ])
      const previousUser = queryClient.getQueryData<IUser>([
        'user',
        user?.username,
      ])

      queryClient.setQueryData<ICloseFriendsListRes>(
        ['closeFriendsList'],
        (old) => {
          if (!old || !user) return old

          return {
            ...old,
            data: old.data.filter((item) => item.username !== user.username),
          }
        },
      )
      queryClient.setQueryData<IRegisteredUser>(
        ['user', user?.username],
        (old) => {
          if (!old || !user) return old

          return {
            ...old,
            data: {
              ...old.data,
              isCloseFriend: false,
            },
          }
        },
      )

      return { previousList, previousUser }
    },
    onSuccess: () => {
      notify.success(
        `${user?.firstName || user?.username} با موفقیت از لیست دوستان نزدیک حذف شد`,
        {
          position: 'top-right',
          duration: 10000,
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['closeFriendsList'], context.previousList)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', user?.username], context.previousList)
      }

      if (error instanceof AxiosError) {
        notify.error(error.response?.data.message, {
          position: 'top-right',
          duration: 10000,
        })
      } else {
        console.error(error)
      }
    },
  })
}

export function useRemoveFollower(userName: string) {
  const queryClient = useQueryClient()
  const { data: me } = useMe()

  return useMutation({
    mutationKey: ['remove-follower', userName],
    mutationFn: () => removeFollower(userName),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['me'] })
      await queryClient.cancelQueries({ queryKey: ['followersList', userName] })

      const previousMe = queryClient.getQueryData<IRegisteredUser>(['me'])
      const previousFollowers = queryClient.getQueryData<IFollowersListRes>([
        'followersList',
        me?.data.username,
      ])

      queryClient.setQueryData<IFollowersListRes | undefined>(
        ['followersList', me?.data.username],
        (old) => {
          if (!old || !me?.data) return old

          return {
            ...old,
            data: old.data.filter((u) => u.username !== userName),
          }
        },
      )

      queryClient.setQueryData<IRegisteredUser>(['me'], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            followerCount: (old.data.followerCount ?? 0) - 1,
          },
        }
      })

      return { previousFollowers, previousMe }
    },
    onError: (error, _variables, context) => {
      if (context?.previousFollowers) {
        queryClient.setQueryData(
          ['followeList', me?.data.username],
          context.previousFollowers,
        )
      }
      if (context?.previousMe) {
        queryClient.setQueryData(['me'], context.previousMe)
      }

      if (error instanceof AxiosError) {
        notify.error(error.response?.data.message, {
          position: 'top-right',
          duration: 10000,
        })
      } else {
        console.error(error)
      }
    },
  })
}

export function useFollowAction(userName: string) {
  const queryClient = useQueryClient()
  const { data: me } = useMe()
  const { data: user } = useGetUser(userName)

  const mutation = useMutation({
    mutationKey: ['follow', userName],
    mutationFn: async () => {
      if (!userName) throw new Error('Username is not available yet!')
      return followAction(userName)
    },
    onMutate: async () => {
      if (user?.data.isPrivate && !user.data.isFollowing) return

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
