import { useGetCloseFriends } from '@/features/relationships/hooks/useRelations'
import { FriendsAndBlockedTab } from '../components/FriendsAndBlockedTab'
import { RelationsRow } from '../components/RelationsRow'
import { Loading } from '@/features/common/components/ui/loading'

export const CloseFriendsPage = () => {
  const { data: closeFriends, isPending } = useGetCloseFriends()

  return (
    <div className="h-full flex flex-col max-md:items-center py-2">
      <FriendsAndBlockedTab />

      <div className="w-full flex flex-col gap-4 max-w-lg ml-auto py-8 overflow-y-auto h-full">
        {isPending ? (
          <Loading />
        ) : closeFriends?.data?.length ? (
          closeFriends.data.map((closefriend) => (
            <RelationsRow
              key={closefriend.id}
              user={closefriend}
              mode="closeFriends"
            />
          ))
        ) : (
          <p className="text-center text-gray-500">هنوز فردی را اضافه نکردید</p>
        )}
      </div>
    </div>
  )
}
