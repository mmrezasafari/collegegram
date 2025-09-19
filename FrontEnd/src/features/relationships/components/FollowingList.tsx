import { RelationsRow } from './RelationsRow'
import { Separator } from '@/features/common/components/ui/separator'
import { useGetFollowings } from '../hooks/useRelations'
import { Button } from '@/features/common/components/ui/button'

interface IProps {
  onClose: () => void
}

export const FollowingsList = ({ onClose }: IProps) => {
  const { data: followingsRes } = useGetFollowings()
  const followingList = followingsRes?.data

  return (
    <div className="h-full w-full flex justify-center mt-4">
      <div className="w-[350px] flex flex-col gap-8">
        <div className="h-[400px] overflow-y-auto px-2">
          {followingList?.length ? (
            followingList?.map((friend) => (
              <div key={friend.id}>
                <RelationsRow key={friend.id} user={friend} />
                <Separator className="bg-geryLight h-1 my-4" />
              </div>
            ))
          ) : (
            <p className="h-full text-center text-bold">
              این کاربر فردی را دنبال نمی‌کند
            </p>
          )}
        </div>
        <Button className="w-fit self-end" onClick={() => onClose()}>
          بستن
        </Button>
      </div>
    </div>
  )
}
