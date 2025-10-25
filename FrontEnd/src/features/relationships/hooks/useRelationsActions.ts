import { notify } from '@/features/common/components/ui/sonner'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import api from '@/lib/axios'
import type { ISuccessRes } from '@/types/error'
import type { INotification } from '@/types/notification'
import type {
  IAddCloseFriendRes,
  IBlockList,
  IBlockListRes,
  IBlockUserRes,
  ICloseFriend,
  ICloseFriendsListRes,
  IFollowersListRes,
  IFollowRes,
  IRemoveFollowerRes,
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

export async function respond(
  userName: string,
  payload: { accept: boolean },
): Promise<ISuccessRes> {
  const res = await api.post(`users/${userName}/respond`, payload)
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
    mutationFn: (payload: { accept: boolean }) => respond(userName, payload),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['notifications', 'me', 'infinite'],
      })

      const previousData = queryClient.getQueryData<{
        pages: INotification[][]
      }>(['notifications', 'me', 'infinite'])

      if (previousData) {
        const newPages = previousData.pages.map((page) =>
          page.map((notif) =>
            notif.actor.username === userName
              ? {
                ...notif,
                actor: {
                  ...notif.actor,
                  isFollowing: true,
                },
              }
              : notif,
          ),
        )

        queryClient.setQueryData(['notifications', 'me', 'infinite'], {
          ...previousData,
          pages: newPages,
        })
      }

      return { previousData }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ['notifications', 'me', 'infinite'],
          context.previousData,
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'me', 'infinite'],
      })
    },
  })
}

export function useAddToBlockList(user: IUser) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['add-blockList', user?.username],
    mutationFn: () => addToBlockList(user?.username),

    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['blockList'] }),
        queryClient.cancelQueries({ queryKey: ['user', user?.username] }),
      ])

      const previousList = queryClient.getQueryData<IBlockListRes>([
        'blockList',
      ])
      const previousUser = queryClient.getQueryData<IRegisteredUser>([
        'user',
        user?.username,
      ])

      const optimisticBlock: IBlockList = {
        id: user.id,
        username: user.username,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        imageUrl: user.imagePath ?? '',
        followersCount: user.followerCount ?? 0,
      }

      // Optimistic update: block list
      queryClient.setQueryData<IBlockListRes>(['blockList'], (old) =>
        old ? { ...old, data: [...old.data, optimisticBlock] } : old,
      )

      // Optimistic update: user
      queryClient.setQueryData<IRegisteredUser>(
        ['user', user?.username],
        (old) =>
          old
            ? {
              ...old,
              data: {
                ...old.data,
                isBlockedByMe: true,
                isCloseFriend: false,
              },
            }
            : old,
      )

      return { previousList, previousUser }
    },

    onError: (error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['blockList'], context.previousList)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', user?.username], context.previousUser)
      }

      if (error instanceof AxiosError) {
        notify.error(
          error.response?.data.message ?? 'خطا در افزودن به لیست بلاک',
          {
            position: 'top-right',
            duration: 10000,
          },
        )
      } else {
        console.error(error)
      }
    },

    onSuccess: () => {
      notify.success(
        `${user?.firstName || user?.username} با موفقیت به لیست بلاک اضافه شد`,
        {
          position: 'top-right',
          duration: 10000,
        },
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blockList'] })
      queryClient.invalidateQueries({ queryKey: ['user', user?.username] })
    },
  })
}

export function useRemoveFromBlockList(user: IUser) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['remove-blockList', user?.username],
    mutationFn: () => removeFromBlockList(user?.username),

    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['blockList'] }),
        queryClient.cancelQueries({ queryKey: ['user', user?.username] }),
      ])

      const previousList = queryClient.getQueryData<IBlockListRes>([
        'blockList',
      ])
      const previousUser = queryClient.getQueryData<IRegisteredUser>([
        'user',
        user?.username,
      ])

      // Optimistic update: block list
      queryClient.setQueryData<IBlockListRes>(['blockList'], (old) =>
        old
          ? {
            ...old,
            data: old.data.filter((item) => item.username !== user.username),
          }
          : old,
      )

      // Optimistic update: user
      queryClient.setQueryData<IRegisteredUser>(
        ['user', user?.username],
        (old) =>
          old
            ? {
              ...old,
              data: {
                ...old.data,
                isBlockedByMe: false,
              },
            }
            : old,
      )

      return { previousList, previousUser }
    },

    onError: (error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['blockList'], context.previousList)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', user?.username], context.previousUser)
      }

      if (error instanceof AxiosError) {
        notify.error(
          error.response?.data.message ?? 'خطا در حذف از لیست بلاک',
          {
            position: 'top-right',
            duration: 10000,
          },
        )
      } else {
        console.error(error)
      }
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

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blockList'] })
      queryClient.invalidateQueries({ queryKey: ['user', user?.username] })
    },
  })
}

export function useAddToCloseFriends(user: IUser) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['add-closeFriends', user?.username],
    mutationFn: () => addToCloseFriend(user?.username),

    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['closeFriendsList'] }),
        queryClient.cancelQueries({ queryKey: ['user', user?.username] }),
      ])

      const previousList = queryClient.getQueryData<ICloseFriendsListRes>([
        'closeFriendsList',
      ])
      const previousUser = queryClient.getQueryData<IRegisteredUser>([
        'user',
        user?.username,
      ])

      const optimisticFriend: ICloseFriend = {
        id: user.id,
        username: user.username,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        imageUrl: user.imagePath ?? '',
        followersCount: user.followerCount ?? 0,
      }

      // Optimistic update: closeFriendsList
      queryClient.setQueryData<ICloseFriendsListRes>(
        ['closeFriendsList'],
        (old) =>
          old ? { ...old, data: [...old.data, optimisticFriend] } : old,
      )

      // Optimistic update: user
      queryClient.setQueryData<IRegisteredUser>(
        ['user', user?.username],
        (old) =>
          old
            ? {
              ...old,
              data: {
                ...old.data,
                isCloseFriend: true,
              },
            }
            : old,
      )

      return { previousList, previousUser }
    },

    onError: (error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['closeFriendsList'], context.previousList)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', user?.username], context.previousUser)
      }

      if (error instanceof AxiosError) {
        notify.error(
          error.response?.data.message ?? 'خطا در افزودن به دوستان نزدیک',
          {
            position: 'top-right',
            duration: 10000,
          },
        )
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

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['closeFriendsList'] })
      queryClient.invalidateQueries({ queryKey: ['user', user?.username] })
    },
  })
}

export function useRemoveFromCloseFriends(user: IUser) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['remove-closeFriends', user?.username],
    mutationFn: () => removeFromCloseFriends(user?.username),

    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['closeFriendsList'] }),
        queryClient.cancelQueries({ queryKey: ['user', user?.username] }),
      ])

      const previousList = queryClient.getQueryData<ICloseFriendsListRes>([
        'closeFriendsList',
      ])
      const previousUser = queryClient.getQueryData<IRegisteredUser>([
        'user',
        user?.username,
      ])

      // Optimistic update: closeFriendsList
      queryClient.setQueryData<ICloseFriendsListRes>(
        ['closeFriendsList'],
        (old) =>
          old
            ? {
              ...old,
              data: old.data.filter(
                (item) => item.username !== user.username,
              ),
            }
            : old,
      )

      // Optimistic update: user
      queryClient.setQueryData<IRegisteredUser>(
        ['user', user?.username],
        (old) =>
          old
            ? {
              ...old,
              data: {
                ...old.data,
                isCloseFriend: false,
              },
            }
            : old,
      )

      return { previousList, previousUser }
    },

    onError: (error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['closeFriendsList'], context.previousList)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', user?.username], context.previousUser)
      }

      if (error instanceof AxiosError) {
        notify.error(
          error.response?.data.message ?? 'خطا در حذف از دوستان نزدیک',
          {
            position: 'top-right',
            duration: 10000,
          },
        )
      } else {
        console.error(error)
      }
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

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['closeFriendsList'] })
      queryClient.invalidateQueries({ queryKey: ['user', user?.username] })
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
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['me'] }),
        queryClient.cancelQueries({
          queryKey: ['followersList', me?.data.username],
        }),
      ])

      const previousMe = queryClient.getQueryData<IRegisteredUser>(['me'])
      const previousFollowers = queryClient.getQueryData<IFollowersListRes>([
        'followersList',
        me?.data.username,
      ])

      // Optimistic update: followers list
      queryClient.setQueryData<IFollowersListRes>(
        ['followersList', me?.data.username],
        (old) =>
          old
            ? {
              ...old,
              data: old.data.filter((u) => u.username !== userName),
            }
            : old,
      )

      // Optimistic update: me
      queryClient.setQueryData<IRegisteredUser>(['me'], (old) =>
        old
          ? {
            ...old,
            data: {
              ...old.data,
              followerCount: Math.max((old.data.followerCount ?? 1) - 1, 0),
            },
          }
          : old,
      )

      return { previousMe, previousFollowers }
    },

    onError: (error, _variables, context) => {
      if (context?.previousFollowers) {
        queryClient.setQueryData(
          ['followersList', me?.data.username],
          context.previousFollowers,
        )
      }
      if (context?.previousMe) {
        queryClient.setQueryData(['me'], context.previousMe)
      }

      if (error instanceof AxiosError) {
        notify.error(error.response?.data.message ?? 'خطا در حذف دنبال‌کننده', {
          position: 'top-right',
          duration: 10000,
        })
      } else {
        console.error(error)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({
        queryKey: ['followersList', me?.data.username],
      })
    },
  })
}

export function useFollowAction(userName: string) {
  const queryClient = useQueryClient()
  const { data: me } = useMe()

  const mutation = useMutation<IFollowRes, Error, void, any>({
    mutationKey: ['follow', userName],
    mutationFn: async () => {
      if (!userName) {
        throw new Error('Cannot follow private user without permission')
      }
      return followAction(userName)
    },

    // onMutate: async () => {
    //   await Promise.all([
    //     queryClient.cancelQueries({ queryKey: ['user', userName] }),
    //     queryClient.cancelQueries({ queryKey: ['me'] }),
    //     queryClient.cancelQueries({ queryKey: ['followersList', userName] }),
    //     queryClient.cancelQueries({
    //       queryKey: ['followingsList', me?.data.username],
    //     }),
    //   ])
    //
    //   const previousUser = queryClient.getQueryData<IRegisteredUser>([
    //     'user',
    //     userName,
    //   ])
    //   const previousMe = queryClient.getQueryData<IRegisteredUser>(['me'])
    //   const previousFollowers = queryClient.getQueryData<IFollowersListRes>([
    //     'followersList',
    //     userName,
    //   ])
    //   const previousFollowings = queryClient.getQueryData<IFollowingsListRes>([
    //     'followingsList',
    //     me?.data.username,
    //   ])
    //
    //   const meUser = me?.data && {
    //     id: me.data.id,
    //     username: me.data.username,
    //     firstName: me.data.firstName,
    //     lastName: me.data.lastName,
    //     imageUrl: me.data.imagePath,
    //     followerCount: me.data.followerCount,
    //     followingCount: me.data.followingCount,
    //     isFollowing: me.data.isFollowing,
    //     email: me.data.email,
    //   }
    //
    //   // Optimistic update: user
    //   queryClient.setQueryData<IRegisteredUser>(['user', userName], (old) =>
    //     old
    //       ? {
    //           ...old,
    //           data: {
    //             ...old.data,
    //             isFollowing: !old.data.isFollowing,
    //             followerCount: (old.data.followerCount ?? 0) + 1,
    //           },
    //         }
    //       : old,
    //   )
    //
    //   // Optimistic update: me
    //   queryClient.setQueryData<IRegisteredUser>(['me'], (old) =>
    //     old
    //       ? {
    //           ...old,
    //           data: {
    //             ...old.data,
    //             followingCount: (old.data.followingCount ?? 0) + 1,
    //           },
    //         }
    //       : old,
    //   )
    //
    //   // Optimistic update: followers list
    //   queryClient.setQueryData<IFollowersListRes>(
    //     ['followersList', userName],
    //     (old) =>
    //       old && meUser && !old.data.find((u) => u.username === meUser.username)
    //         ? { ...old, data: [...old.data, meUser] }
    //         : old,
    //   )
    //
    //   // Optimistic update: followings list
    //   queryClient.setQueryData<IFollowingsListRes>(
    //     ['followingsList', me?.data.username],
    //     (old) =>
    //       old && meUser ? { ...old, data: [...old.data, meUser] } : old,
    //   )
    //
    //   return { previousUser, previousMe, previousFollowers, previousFollowings }
    // },
    //
    // onError: (_err, _variables, context) => {
    //   if (context?.previousUser)
    //     queryClient.setQueryData(['user', userName], context.previousUser)
    //   if (context?.previousMe)
    //     queryClient.setQueryData(['me'], context.previousMe)
    //   if (context?.previousFollowers)
    //     queryClient.setQueryData(
    //       ['followersList', userName],
    //       context.previousFollowers,
    //     )
    //   if (context?.previousFollowings)
    //     queryClient.setQueryData(
    //       ['followingsList', me?.data.username],
    //       context.previousFollowings,
    //     )
    // },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relation-status', userName] })
    },

    onSettled: () => {
      if (!userName || !me?.data) return
      queryClient.invalidateQueries({ queryKey: ['user', userName] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['followersList', userName] })
      queryClient.invalidateQueries({
        queryKey: ['followingsList', me.data.username],
      })
      queryClient.invalidateQueries({ queryKey: ['relation-status', userName] })
    },
  })

  useEffect(() => {
    if (userName) {
      queryClient.prefetchQuery({ queryKey: ['user', userName] })
    }
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

    // onMutate: async () => {
    //   await Promise.all([
    //     queryClient.cancelQueries({ queryKey: ['user', userName] }),
    //     queryClient.cancelQueries({ queryKey: ['me'] }),
    //     queryClient.cancelQueries({ queryKey: ['followersList', userName] }),
    //     queryClient.cancelQueries({
    //       queryKey: ['followingsList', me?.data.username],
    //     }),
    //   ])
    //
    //   const previousUser = queryClient.getQueryData<IRegisteredUser>([
    //     'user',
    //     userName,
    //   ])
    //   const previousMe = queryClient.getQueryData<IRegisteredUser>(['me'])
    //   const previousFollowers = queryClient.getQueryData<IFollowersListRes>([
    //     'followersList',
    //     userName,
    //   ])
    //   const previousFollowings = queryClient.getQueryData<IFollowingsListRes>([
    //     'followingsList',
    //     me?.data.username,
    //   ])
    //
    //   // Optimistic update: user
    //   queryClient.setQueryData<IRegisteredUser>(['user', userName], (old) =>
    //     old
    //       ? {
    //           ...old,
    //           data: {
    //             ...old.data,
    //             isFollowing: false,
    //             followerCount: Math.max((old.data.followerCount ?? 1) - 1, 0),
    //           },
    //         }
    //       : old,
    //   )
    //
    //   // Optimistic update: me
    //   queryClient.setQueryData<IRegisteredUser>(['me'], (old) =>
    //     old
    //       ? {
    //           ...old,
    //           data: {
    //             ...old.data,
    //             followingCount: Math.max((old.data.followingCount ?? 1) - 1, 0),
    //           },
    //         }
    //       : old,
    //   )
    //
    //   // Optimistic update: followers list
    //   queryClient.setQueryData<IFollowersListRes>(
    //     ['followersList', userName],
    //     (old) =>
    //       old && me?.data
    //         ? {
    //             ...old,
    //             data: old.data.filter((u) => u.username !== me.data.username),
    //           }
    //         : old,
    //   )
    //
    //   // Optimistic update: followings list
    //   queryClient.setQueryData<IFollowingsListRes>(
    //     ['followingsList', me?.data.username],
    //     (old) =>
    //       old
    //         ? {
    //             ...old,
    //             data: old.data.filter((u) => u.username !== userName),
    //           }
    //         : old,
    //   )
    //
    //   return { previousUser, previousMe, previousFollowers, previousFollowings }
    // },
    //
    // onError: (_err, _variables, context) => {
    //   if (context?.previousUser)
    //     queryClient.setQueryData(['user', userName], context.previousUser)
    //   if (context?.previousMe)
    //     queryClient.setQueryData(['me'], context.previousMe)
    //   if (context?.previousFollowers)
    //     queryClient.setQueryData(
    //       ['followersList', userName],
    //       context.previousFollowers,
    //     )
    //   if (context?.previousFollowings)
    //     queryClient.setQueryData(
    //       ['followingsList', me?.data.username],
    //       context.previousFollowings,
    //     )
    // },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relation-status', userName] })
    },

    onSettled: () => {
      if (!userName || !me?.data) return
      queryClient.invalidateQueries({ queryKey: ['user', userName] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['followersList', userName] })
      queryClient.invalidateQueries({
        queryKey: ['followingsList', me.data.username],
      })
      queryClient.invalidateQueries({ queryKey: ['relation-status', userName] })
    },
  })

  useEffect(() => {
    if (userName) {
      queryClient.prefetchQuery({ queryKey: ['user', userName] })
    }
  }, [userName, queryClient])

  return mutation
}
