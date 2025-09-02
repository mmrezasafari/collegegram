import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type { ILogin, ILoginRes, IRegister, IRegisterRes } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'
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
  return useMutation({
    mutationKey: ['registerUser'],
    mutationFn: registerUser,
    onSuccess: () => {
      notify.success('اطلاعات با موفقیت ثبت شد', {
        position: 'top-right',
        duration: 10000,
      })
    },
    onError: (error) => {
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

export function useLogin() {
  return useMutation({
    mutationKey: ['loginUser'],
    mutationFn: loginUser,
    onSuccess: () => {
      notify.success('خوش آمدید', {
        position: 'top-right',
        duration: 10000,
      })
    },
    onError: (error) => {
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
