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
import { BlockedListPage } from '@/features/relationships/components/BlockedListTab'
import { CloseFriendsPage } from '@/features/relationships/components/CloseFriendsTab'
import { Error404 } from '@/features/common/pages/Error404'
import { MentionPage } from '@/features/mention/pages/MentionPage'
import { FriendsAndBlockedPage } from '@/features/relationships/pages/FriendsAndBlockedPage'

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
          { index: true, path: '/explore', element: <ExplorePage /> },
          { path: '/profile', element: <OwnProfilePage /> },
          { path: '/profile/:username', element: <UserProfilePage /> },
          { path: '/mentions', element: <MentionPage /> },
          { path: '/bookmarks', element: <BookmarkPage /> },
          { path: '/search', element: <SearchPage /> },
          {
            path: '/blocklist-closefriends/block-list',
            element: <BlockedListPage />,
          },
          {
            path: '/blocklist-closefriends/close-friends',
            element: <CloseFriendsPage />,
          },
          {
            path: '/blocklist-closefriends',
            element: <FriendsAndBlockedPage />,
          },
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
