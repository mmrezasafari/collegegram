import { useState } from 'react'
import { Button } from '@/features/common/components/ui/button'
import FriendBar from '@/features/explore/components/FriendBar'
import {
  useFollowAction,
  useUnfollowAction,
} from '@/features/relationships/hooks/useRelationsActions'
import { Plus } from 'lucide-react'
import { useGetRelationStatus } from '@/features/relationships/hooks/useRelations'
import type { ISearchedUserData } from '@/types/search'
import { useNavigate } from 'react-router-dom'

export const UserCard = ({ user }: { user: ISearchedUserData }) => {
  const navigate = useNavigate()
  // Local state for follow status and count, typecast count as number
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [followCount, setFollowCount] = useState<number>(
    Number(user.followersCount) || 0,
  )

  const { data: relationStatus } = useGetRelationStatus(user.username, {})
  const followStatus = relationStatus?.data

  const { mutate: unFollowMutation } = useUnfollowAction(user.username)
  const { mutate: followMutation } = useFollowAction(user.username)

  const handleFollow = () => {
    followMutation(undefined, {
      onSuccess: () => {
        setIsFollowing(true)
        setFollowCount((count) => Number(count) + 1)
      },
    })
  }

  const handleUnFollow = () => {
    unFollowMutation(undefined, {
      onSuccess: () => {
        setIsFollowing(false)
        setFollowCount((count) => Number(count) - 1)
      },
    })
  }

  const handleCardClick = () => {
    navigate(`/profile/${user.username}`)
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-md flex flex-col items-center p-8 w-[340px] h-[184px] justify-between cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-full">
        <FriendBar
          firstName={user?.firstName || user?.username || ''}
          lastName={user?.lastName || ''}
          followCount={followCount}
          avatarUrl={user?.imagePath || ''}
        />
      </div>
      <div className="flex w-full justify-center">
        {isFollowing && followStatus?.status === 'ACCEPTED' ? (
          <Button
            className="flex w-[150px]"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleUnFollow()
            }}
          >
            <span>دنبال نکردن</span>
          </Button>
        ) : followStatus && followStatus?.status === 'PENDING' ? (
          <Button
            className="flex w-[150px]"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleUnFollow()
            }}
          >
            <span>لغو در‌خواست</span>
          </Button>
        ) : (
          <Button
            className="flex w-[150px]"
            variant="default"
            onClick={(e) => {
              e.stopPropagation()
              handleFollow()
            }}
          >
            <Plus />
            <span>دنبال کردن</span>
          </Button>
        )}
      </div>
    </div>
  )
}
