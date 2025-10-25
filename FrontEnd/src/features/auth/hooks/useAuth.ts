import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type { ILogin, ILoginRes, IRegister, IRegisterRes } from '@/types/auth'
import type { IErrorRes } from '@/types/error'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

async function registerUser(user: IRegister): Promise<IRegisterRes> {
  const res = await api.post<IRegisterRes>('/register', user)

  return res.data
}

async function loginUser(user: ILogin): Promise<ILoginRes> {
  const res = await api.post<ILoginRes>('/login', user)

  return res.data
}

export function useRegister() {
  return useMutation<IRegisterRes, AxiosError<IErrorRes>, IRegister>({
    mutationKey: ['registerUser'],
    mutationFn: registerUser,

    onSuccess: () => {
      notify.success('اطلاعات با موفقیت ثبت شد', {
        position: 'top-right',
        duration: 10000,
      })
    },

    onError: (error) => {
      notify.error(error.response?.data?.message ?? 'خطا در ثبت اطلاعات', {
        position: 'top-right',
        duration: 10000,
      })
    },
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation<ILoginRes, AxiosError<IErrorRes>, ILogin>({
    mutationKey: ['loginUser'],
    mutationFn: loginUser,

    onSuccess: async () => {
      notify.success('خوش آمدید', {
        position: 'top-right',
        duration: 10000,
      })

      await queryClient.invalidateQueries({ queryKey: ['me'] })
    },

    onError: (error) => {
      notify.error(error.response?.data?.message ?? 'خطا در ورود به حساب', {
        position: 'top-right',
        duration: 10000,
      })
    },
  })
}
