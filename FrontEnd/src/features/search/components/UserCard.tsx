import { Button } from '@/features/common/components/ui/button'
import FriendBar from '@/features/explore/components/FriendBar'
import {
  useFollowAction,
  useUnfollowAction,
} from '@/features/relationships/hooks/useRelationsActions'
import type { ISearchedUsersData } from '@/types/search'
import { Plus } from 'lucide-react'

interface UserCardProps {
  cardData: ISearchedUsersData
  onButtonClick?: () => void
}

export function UserCard({ cardData }: UserCardProps) {
  const { mutate: unFollowMutation } = useUnfollowAction(cardData.username)
  const { mutate: followMutation } = useFollowAction(cardData.username)

  const handleFollow = () => {
    followMutation()
  }

  const handleUnFollow = () => {
    unFollowMutation()
  }

  return (
    <div className="bg-white rounded-2xl shadow-md flex flex-col items-center p-6 w-[340px] h-[180px] justify-between">
      <FriendBar
        firstName={cardData?.username}
        lastName={cardData?.lastName}
        followCount={cardData?.followerCount}
        avatarUrl={cardData?.imagePath}
      />

      {cardData?.isFollowing ? (
        <Button
          className="flex w-full"
          variant="outline"
          onClick={handleUnFollow}
        >
          <span>دنبال نکردن</span>
        </Button>
      ) : (
        <Button
          className="flex w-full"
          variant="default"
          onClick={handleFollow}
        >
          <Plus />
          <span>دنبال کردن</span>
        </Button>
      )}
    </div>
  )
}
