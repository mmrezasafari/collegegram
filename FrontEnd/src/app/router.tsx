import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProfileLayout } from '@/layouts/ProfileLayout'
import { OwnProfilePage } from '@/features/profile/pages/OwnProfilePage'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import { UserProfilePage } from '@/features/profile/pages/UserProfilePage'
import { ExplorePage } from '@/features/explore/pages/ExplorePage'
import { BookmarkPage } from '@/features/bookmark/pages/BookmarkPage'
import { PostDetailsPage } from '@/features/post/pages/PostDetailsPage'
import { PostLayout } from '@/layouts/PostLayout'
import { SearchPage } from '@/features/search/pages/searchpage'
import { BlockedListPage } from '@/features/relationships/pages/BlockListPage'
import { CloseFriendsPage } from '@/features/relationships/pages/CloseFriendsPage'
import { Error404 } from '@/features/common/pages/Error404'
import { MentionPage } from '@/features/mention/pages/MentionPage'
import { NotificationPage } from '@/features/notification/pages/notificationPage'
import { ForgetPassword } from '@/features/auth/components/ForgetPassword'
import { RenewPassword } from '@/features/auth/components/RenewPassword'

export const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  )
}

function ProtectedRoute() {
  const { data: me, isLoading } = useMe()

  if (isLoading) return <LoadingPage />
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
  { path: '/forgetpassword', element: <ForgetPassword /> },
  { path: '/renewpassword', element: <RenewPassword /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProfileLayout />,
        children: [
          { index: true, path: '/explore', element: <ExplorePage /> },
          { path: '/profile', element: <OwnProfilePage /> },
          { path: '/profile/:username', element: <UserProfilePage /> },
          { path: '/mentions', element: <MentionPage /> },
          { path: '/bookmarks', element: <BookmarkPage /> },
          { path: '/search', element: <SearchPage /> },
          { path: '/block-list', element: <BlockedListPage /> },
          { path: '/close-friends', element: <CloseFriendsPage /> },
          { path: '/notifications', element: <NotificationPage /> },
          { path: '/logout', element: <AuthLayout /> },
        ],
      },
      {
        element: <PostLayout />,
        children: [{ path: '/post/:postId', element: <PostDetailsPage /> }],
      },
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
])
