import { RelationsRow } from './RelationsRow'
import { Separator } from '@/features/common/components/ui/separator'
import { useGetFollowers } from '../hooks/useRelations'
import { Button } from '@/features/common/components/ui/button'
import { Loading } from '@/features/common/components/ui/loading'

interface IProps {
  onClose: () => void
  userName: string
}

export const FollowersList = ({ onClose, userName }: IProps) => {
  const { data: followersRes, isPending } = useGetFollowers(userName)
  const followersList = followersRes?.data

  return (
    <div className="h-full w-full flex justify-center mt-4">
      <div className="w-[350px] flex flex-col gap-8">
        <div className="h-[400px] overflow-y-auto px-2">
          {isPending ? (
            <Loading className="justify-center" />
          ) : followersList?.length ? (
            followersList.map((friend) => (
              <div key={friend.id}>
                <RelationsRow user={friend} mode="followers" />
                <Separator className="bg-geryLight h-1 my-4" />
              </div>
            ))
          ) : (
            <p className="h-full text-center font-bold">
              فردی این کاربر را دنبال نمی‌کند
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
