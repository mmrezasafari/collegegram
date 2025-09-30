import { RelationsRow } from './RelationsRow'
import { Separator } from '@/features/common/components/ui/separator'
import { useGetFollowings } from '../hooks/useRelations'
import { Button } from '@/features/common/components/ui/button'

interface IProps {
  onClose: () => void
  userName: string
}

export const FollowingsList = ({ onClose, userName }: IProps) => {
  const { data: followingsRes } = useGetFollowings(userName)
  const followingList = followingsRes?.data

  return (
    <div className="h-full w-full flex justify-center mt-4">
      <div className="w-full flex flex-col gap-8 px-6">
        <div className="h-[400px] overflow-y-auto px-4">
          {followingList?.length ? (
            followingList?.map((friend) => (
              <div key={friend.id}>
                <RelationsRow user={friend} mode="followings" />
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
