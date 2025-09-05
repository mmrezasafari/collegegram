import type { IRegisteredUser } from '@/types/user'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export function UseGetUserName() {
  const querClient = useQueryClient()
  const params = useParams()
  const catchedUser = querClient.getQueryData<IRegisteredUser>(['me'])

  const effectiveUsername = params.username || catchedUser?.data.username

  return effectiveUsername
}
