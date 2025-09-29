import { useGetCloseFriends } from '@/features/relationships/hooks/useRelations'
import { RelationsRow } from './RelationsRow'
import { useEffect } from 'react'

export const CloseFriendsPage = () => {
  const { data: closeFriends, refetch } = useGetCloseFriends()

  useEffect(() => {
    const handleRefresh = () => {
      refetch()
    }

    window.addEventListener('refreshCloseFriends', handleRefresh)
    return () => {
      window.removeEventListener('refreshCloseFriends', handleRefresh)
    }
  }, [refetch])

  return (
    <div className="h-full flex flex-col max-md:items-center py-2">
      <div className="flex flex-col gap-8 max-w-lg ml-auto">
        {closeFriends?.data &&
          closeFriends.data.map((closefriend) => (
            <RelationsRow key={closefriend.id} user={closefriend} />
          ))}
      </div>
    </div>
  )
}
