import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type { IRegister, IRegisterRes } from '@/types/auth'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

async function registerUser(user: IRegister): Promise<IRegisterRes> {
  const res = await api.post<IRegisterRes>('/register', user)

  return res.data
}

export function useRegister() {
  const queryClient = useQueryClient()

  const registerMutation = useMutation({
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
