import { useGetCloseFriends } from '@/features/relationships/hooks/useRelations'
import { FriendsAndBlockedTab } from '../components/FriendsAndBlockedTab'
import { RelationsRow } from '../components/RelationsRow'

export const CloseFriendsPage = () => {
  const { data: closeFriends } = useGetCloseFriends()

  return (
    <div className="h-full flex flex-col max-md:items-center py-2">
      <FriendsAndBlockedTab />
      <div className="flex flex-col gap-8 max-w-lg ml-auto">
        {closeFriends?.data &&
          closeFriends.data.map((closefriend) => (
            <RelationsRow
              key={closefriend.id}
              user={closefriend}
              mode="closeFriends"
            />
          ))}
      </div>
    </div>
  )
}
