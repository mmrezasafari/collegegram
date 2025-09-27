import { Button } from '@/features/common/components/ui/button'
import FriendBar from '@/features/explore/components/FriendBar'
import {
  useFollowAction,
  useUnfollowAction,
} from '@/features/relationships/hooks/useRelations'
import type { IExplore } from '@/types/explore'
import { Plus } from 'lucide-react'

// interface IUserCardDataRes {
//   success: boolean
//   data: IUserCardData[]
// }
//
// interface IUserCardData {
//   isFollowing: boolean
//   followerCount: number
// }

interface FriendCardProps {
  friendData: IExplore
}

// interface UserCardProps {
//   name: string
//   avatar: string
//   isFollowing?: boolean
//   followerCount: number
// }

export const UserCard = ({ friendData }: FriendCardProps) => {
  const { mutate: unFollowMutation } = useUnfollowAction()
  const { mutate: followMutation } = useFollowAction()

  const handleFollow = () => {
    followMutation()
  }

  const handleUnFollow = () => {
    unFollowMutation()
  }

  if (!friendData) return null // or a fallback UI

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md flex flex-col items-center p-6 w-[340px] h-[180px] justify-between">
        <FriendBar
          firstName={friendData.firstName}
          lastName={friendData.lastName}
          followCount={friendData.followerCount}
          avatarUrl={friendData.imagePath}
        />
        <div className="max-md:hidden">
          {friendData.isFollowing ? (
            <Button
              className="flex w-[150px]"
              variant="outline"
              onClick={handleUnFollow}
            >
              <span>دنبال نکردن</span>
            </Button>
          ) : (
            <Button
              className="flex w-[150px]"
              variant="default"
              onClick={handleFollow}
            >
              <Plus />
              <span>دنبال کردن</span>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
