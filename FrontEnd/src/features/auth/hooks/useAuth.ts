import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type { ILogin, ILoginRes, IRegister, IRegisterRes } from '@/types/auth'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
// import { getUserFromCookie } from '@/utils/validation'

async function registerUser(user: IRegister): Promise<IRegisterRes> {
  const res = await api.post<IRegisterRes>('/register', user)

  return res.data
}

async function loginUser(user: ILogin): Promise<ILoginRes> {
  const res = await api.post<ILoginRes>('/login', user)

  return res.data
}

export function useRegister() {
  const queryClient = useQueryClient()

  const registerMutation = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['registerUser'], data)
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

  const { data: registerSuccess } = useQuery({
    queryKey: ['registerUser'],
    initialData: false,
    enabled: false,
    queryFn: async () => false,
  })

  return { registerMutation, registerSuccess }
}

export function useLogin() {
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: loginUser,
    onSuccess: (data) => {
      const dt = getUserFromCookie()
      queryClient.setQueryData(['loginUser'], data)
      notify.success('خوش آمدید', {
        position: 'top-right',
        duration: 10000,
      })
      console.log(dt)
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

  const { data: loginSuccess } = useQuery({
    queryKey: ['registerUser'],
    initialData: false,
    enabled: false,
    queryFn: async () => false,
  })

  return { loginMutation, loginSuccess }
}
