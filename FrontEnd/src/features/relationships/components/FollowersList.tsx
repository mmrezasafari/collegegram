import { RelationsRow } from './RelationsRow'
import { ScrollArea } from '@/features/common/components/ui/scroll-area'
import { Separator } from '@/features/common/components/ui/separator'
import { useGetFollowers } from '../hooks/useRelations'
import { Button } from '@/features/common/components/ui/button'

interface IProps {
  onClose: () => void
}

export const FollowersList = ({ onClose }: IProps) => {
  const { data: followersRes } = useGetFollowers()
  const followersList = followersRes?.data

  return (
    <div className="h-full w-full flex justify-center mt-4">
      <div className="w-[350px] flex flex-col gap-8">
        <ScrollArea className="h-[400px]">
          {followersList?.length ? (
            followersList?.map((friend) => (
              <div key={friend.id}>
                <RelationsRow user={friend} />
                <Separator className="bg-geryLight h-1 my-4" />
              </div>
            ))
          ) : (
            <p className="h-full text-center text-bold">
              فردی این کاربر را دنبال نمی‌کند
            </p>
          )}
        </ScrollArea>
        <Button className="w-fit self-end" onClick={() => onClose()}>
          بستن
        </Button>
      </div>
    </div>
  )
}
