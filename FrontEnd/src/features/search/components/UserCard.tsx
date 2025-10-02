import { useState } from 'react'
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
  // Local state to track follow status (following Collegegram's "prefer local state" convention)
  const [isFollowing, setIsFollowing] = useState(cardData.isFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: unFollowMutation } = useUnfollowAction(cardData.username)
  const { mutate: followMutation } = useFollowAction(cardData.username)

  const handleFollow = () => {
    setIsLoading(true)
    followMutation(undefined, {
      onSuccess: () => {
        setIsFollowing(true) // ✅ Update local state on success
        setIsLoading(false)
      },
      onError: () => {
        setIsLoading(false)
      },
    })
  }

  const handleUnFollow = () => {
    setIsLoading(true)
    unFollowMutation(undefined, {
      onSuccess: () => {
        setIsFollowing(false) // ✅ Update local state on success
        setIsLoading(false)
      },
      onError: () => {
        setIsLoading(false)
      },
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-md flex flex-col items-center p-6 w-[340px] h-[180px] justify-between">
      <FriendBar
        firstName={cardData?.username}
        lastName={cardData?.lastName}
        followCount={cardData?.followersCount}
        avatarUrl={cardData?.imagePath}
      />

      {isFollowing ? (
        <Button
          className="flex w-full"
          variant="outline"
          onClick={handleUnFollow}
          disabled={isLoading}
        >
          <span>{isLoading ? 'در حال پردازش...' : 'دنبال نکردن'}</span>
        </Button>
      ) : (
        <Button
          className="flex w-full"
          variant="default"
          onClick={handleFollow}
          disabled={isLoading}
        >
          <Plus />
          <span>{isLoading ? 'در حال پردازش...' : 'دنبال کردن'}</span>
        </Button>
      )}
    </div>
  )
}
