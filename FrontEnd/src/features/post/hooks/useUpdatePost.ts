import { notify } from '@/features/common/components/ui/sonner'
import { useGetUserName } from '@/features/common/hooks/users/useGetUserName'
import api from '@/lib/axios'
import type { IErrorRes } from '@/types/error'
import type { IGetPostRes, IUpdatedPostRes } from '@/types/posts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

interface INewDataForUpdate {
  mention: string
  caption: string
  onlyCloseFriends: boolean
  images: Array<File>
  imagesName: Array<string>
}

export async function updatePost(
  postId: string,
  data: INewDataForUpdate,
): Promise<IUpdatedPostRes> {
  const formData = new FormData()

  formData.append('caption', data.caption)
  data.imagesName.forEach((name) => formData.append('imageUrls', name))
  data.images.forEach((file) => {
    if (file instanceof File) {
      formData.append('images', file)
    }
  })
  formData.append('mention', data.mention)
  formData.append('onlyCloseFriends', data.onlyCloseFriends ? 'true' : 'false')

  const res = await api.patch<IUpdatedPostRes>(`posts/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data
}

export function useUpdatePost(postId: string) {
  const queryClient = useQueryClient()
  const userName = useGetUserName()

  return useMutation<
    IUpdatedPostRes,
    AxiosError<IErrorRes>,
    INewDataForUpdate,
    { prevPost?: IGetPostRes }
  >({
    mutationKey: ['updatePost', postId],
    mutationFn: (data) => updatePost(postId, data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] })

      const prevPost = queryClient.getQueryData<IGetPostRes>(['post', postId])

      queryClient.setQueryData<IGetPostRes>(['post', postId], (old) =>
        old
          ? {
              ...old,
              data: {
                ...old.data,
                post: {
                  ...old.data.post,
                  caption: newData.caption,
                  images: newData.images.map(
                    (img) =>
                      img instanceof File
                        ? { url: URL.createObjectURL(img) }
                        : { url: img }, // backend url
                  ) as IGetPostRes['data']['post']['images'],
                },
                mentionedUsernames: newData.mention
                  .split('@')
                  .filter((item) => item.length !== 0),
              },
            }
          : old,
      )

      return { prevPost }
    },

    onError: (error, _variables, context) => {
      if (context?.prevPost) {
        queryClient.setQueryData(['post', postId], context.prevPost)
      }

      notify.error(error.response?.data?.message ?? 'خطا در ویرایش پست', {
        position: 'top-right',
        duration: 10000,
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userName] })
      notify.success('پست با موفقیت ویرایش شد', {
        position: 'top-right',
        duration: 10000,
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    },
  })
}
