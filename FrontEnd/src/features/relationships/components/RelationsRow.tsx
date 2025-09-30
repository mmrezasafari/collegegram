import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import { UserRound } from 'lucide-react'
import { RelationsRowDropdownShortcut } from '@/features/relationships/components/RelatiosRowDropdownShortcut'
import type { ICloseFriend, IFollower, IFollowing } from '@/types/relations'

interface IProps {
  mode: 'followers' | 'followings' | 'closeFriends' | 'blockList'
  user: IFollower | IFollowing | ICloseFriend
}

export const RelationsRow = ({ user, mode }: IProps) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex flex-row-reverse items-center gap-4">
        <div className="flex flex-col gap-2">
          <p className="md:text-base text-sm font-bold">
            {user.firstName ? (
              <>
                <span>{user.firstName} </span>
                <span>{user.lastName}</span>
              </>
            ) : (
              <span>{user.username}@</span>
            )}
          </p>
          <div className="md:text-base text-sm font-normal text-grey felx">
            {'followerCount' in user ? user.followerCount : user.followersCount}
            <span> دنبال کننده</span>
          </div>
        </div>
        <Avatar className="w-[56px] h-[56px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
          <AvatarImage
            src={user.imageUrl}
            className="w-full h-full object-cover"
            alt="avatar"
          />
          <AvatarFallback className="w-[35px] h-auto">
            <UserRound
              className="w-full h-full object-cover"
              color="#A5A5A5A5"
              fill="#A5A5A5A5"
              strokeWidth={0}
            />
          </AvatarFallback>
        </Avatar>
      </div>
      <RelationsRowDropdownShortcut user={user} mode={mode} />
    </div>
  )
}
