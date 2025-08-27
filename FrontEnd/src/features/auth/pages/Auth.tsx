// src/app/Auth.tsx
import { AuthLayout } from '@/layouts/AuthLayout'
import { Authenticate } from './AuthPage'
import { Toaster } from 'sonner'

function Auth() {
  return (
    <>
      <AuthLayout>
        <Authenticate />
      </AuthLayout>
      <Toaster />
    </>
  )
}

export default Auth
