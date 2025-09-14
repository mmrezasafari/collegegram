import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProfileLayout } from '@/layouts/ProfileLayout'
import { OwnProfilePage } from '@/features/profile/pages/OwnProfilePage'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import { UserProfilePage } from '@/features/profile/pages/UserProfilePage'
import Explore from '@/features/explore/pages/explore'

function ProtectedRoute() {
  const { data: me, isLoading } = useMe()

  if (isLoading) return <p>Loading...</p>
  if (!me) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProfileLayout />,
        children: [
          { index: true, path: '/explore', element: <Explore /> },
          { path: '/profile', element: <OwnProfilePage /> },
          { path: '/profile/:username', element: <UserProfilePage /> },
        ],
      },
    ],
  },
])
