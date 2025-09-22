import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProfileLayout } from '@/layouts/ProfileLayout'
import { OwnProfilePage } from '@/features/profile/pages/OwnProfilePage'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import { UserProfilePage } from '@/features/profile/pages/UserProfilePage'
import Explore from '@/features/explore/pages/explore'
import { Tagged } from '@/features/tagged/pages/Tagged'
import { Saves } from '@/features/saved/pages/Saves'
import { PostDetailsPage } from '@/features/post/pages/PostDetailsPage'
import { PostLayout } from '@/layouts/PostLayout'
<<<<<<< HEAD
import { SearchPage } from '@/features/search/pages/search'
=======
import { SearchPage } from '@/features/search/pages/searchpage'
>>>>>>> 60d25acf0c6f54b9d6034c63ee62d7108fa7d600

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
          { path: '/tagged', element: <Tagged /> },
          { path: '/saves', element: <Saves /> },
          { path: '/search', element: <SearchPage /> },
        ],
      },
      {
        element: <PostLayout />,
        children: [{ path: '/post/:postId', element: <PostDetailsPage /> }],
      },
    ],
  },
])
