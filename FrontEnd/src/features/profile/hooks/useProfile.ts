import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type { IProfileEditForm, IProfileImagesRes } from '@/types/profile'
import type { IRegisteredUser } from '@/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export async function editProfileInfo(
  value: IProfileEditForm,
): Promise<IRegisteredUser> {
  const res = await api.patch<IRegisteredUser>('/profile/me/', value)

  return res.data
}

export async function editProfileImg(value: File): Promise<IProfileImagesRes> {
  const formData = new FormData()
  formData.append('avatar', value)

  const res = await api.post<IProfileImagesRes>('/profile/image/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data
}

export function useEditProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['editProfile'],
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: IProfileEditForm
      avatar: File | null
    }) => {
      const promises: Promise<any>[] = []

      if (Object.keys(values).length) {
        promises.push(editProfileInfo(values))
      }

      if (avatar) {
        promises.push(editProfileImg(avatar))
      }

      await Promise.all(promises)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      notify.success('اطلاعات با موفقیت ویرایش شد', {
        position: 'top-right',
        duration: 10000,
      })
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        notify.error(err.response?.data?.message ?? 'خطا در ویرایش اطلاعات', {
          position: 'top-right',
          duration: 10000,
        })
      } else {
        console.error(err)
      }
    },
  })
}
