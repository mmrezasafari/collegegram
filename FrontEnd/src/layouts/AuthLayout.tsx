import { AuthPage } from '@/features/auth/pages/AuthPage'

export const AuthLayout = () => {
  return (
    <div className="w-full h-screen md:bg-[url(../assets/images/authLayout-bg.jpg)] md:bg-clip-border md:bg-cover md:bg-center">
      <div className="h-full backdrop-blur-[2px] flex justify-center items-center">
        <AuthPage />
      </div>
    </div>
  )
}
