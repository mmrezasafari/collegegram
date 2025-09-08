import { RelationsRow } from './RelationsRow'
import { ScrollArea } from '@/features/common/components/ui/scroll-area'
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
    <div className='h-full w-full flex justify-center mt-4'>
      <div className="w-[350px] flex flex-col gap-8">
        <ScrollArea className="h-[400px]">
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
        </ScrollArea>
        <Button className="w-fit self-end" onClick={() => onClose()}>بستن</Button>
      </div>
    </div>
  )
}
