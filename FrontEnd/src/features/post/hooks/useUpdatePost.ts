import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type { IErrorRes } from '@/types/error'
import type {
  IGetPostRes,
  IUpdatedPostRes,

} from '@/types/posts'
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

interface INewDataForUpdate {
  mention: string
  caption: string
  images: Array<File>
}

export async function updatePost(postId: string, data: INewDataForUpdate): Promise<IUpdatedPostRes> {
  const formData = new FormData()

  formData.append('caption', data.caption)
  data.images.forEach((file) => {
    formData.append('images', file)
  })
  formData.append('mention', data.mention)

  const res = await api.patch(`posts/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data
}

export function useUpdatePost(postId: string) {
  const queryClient = useQueryClient()

  return useMutation<IUpdatedPostRes, AxiosError<IErrorRes>, INewDataForUpdate>({
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
                images: newData.images.map((img) =>
                  img instanceof File
                    ? { url: URL.createObjectURL(img) }
                    : { url: img } // backend url
                ) as IGetPostRes['data']['post']['images'],
              },
              mentionedUsernames: newData.mention.split('@').filter(item => item.length !== 0),
            },
          }
          : old
      )

      return { prevPost }
    },
    onError: (error) => {
      notify.error(error.response?.data?.message || 'خطا در ویرایش پست', {
        position: 'top-right',
        duration: 10000,
      })
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['post', postId] })
      notify.success('پست با موفقیت ویرایش شد', {
        position: 'top-right',
        duration: 10000,
      })
    },
  })
}
