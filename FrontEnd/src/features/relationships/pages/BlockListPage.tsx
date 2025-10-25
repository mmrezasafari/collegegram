import { Loading } from '@/features/common/components/ui/loading.tsx'
import { FriendsAndBlockedTab } from '../components/FriendsAndBlockedTab.tsx'
import { useGetBlockList } from '../hooks/useRelations.ts'
import { RelationsRow } from '../components/RelationsRow.tsx'
import type { IBlockList } from '@/types/relations.ts'

export function BlockedListPage() {
  const { data: blockList, isPending } = useGetBlockList()
  return (
    <div className="h-full flex flex-col max-md:items-center py-2">
      <FriendsAndBlockedTab />

      <div className="w-full flex flex-col gap-4 max-w-lg ml-auto py-8 overflow-y-auto h-full">
        {isPending ? (
          <Loading />
        ) : blockList?.data?.length ? (
          blockList.data.map((user: IBlockList) => (
            <RelationsRow key={user.id} user={user} mode="blockList" />
          ))
        ) : (
          <p className="text-center text-gray-500">هنوز فردی را اضافه نکردید</p>
        )}
      </div>
    </div>
  )
}
