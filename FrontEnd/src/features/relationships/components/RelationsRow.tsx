import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserRound } from 'lucide-react'
import { ProfileDropdownShortcut } from '@/features/profile/components/ProfileDropdownShortcut'
import type { IFollower, IFollowing } from '@/types/relations'

export const RelationsRow = (user: { user: IFollowing | IFollower }) => {
  const data = user?.user
  return (
    <div className="flex flex-row-reverse w-full justify-between items-center">
      <div className="flex flex-row-reverse items-center gap-4">
        <Avatar className="w-[56px] h-[56px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
          <AvatarImage
            src={data.imageUrl}
            className="w-full h-full"
            alt="avatar"
          />
          <AvatarFallback className="w-[45px] h-auto">
            <UserRound
              className="w-full h-full object-cover"
              color="#A5A5A5A5"
              fill="#A5A5A5A5"
              strokeWidth={0}
            />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-end gap-2">
          <p className="md:text-base text-sm font-bold">
            {data.firstName ? (
              <>
                <span>{data.firstName} </span>
                <span>{data.lastName}</span>
              </>
            ) : (
              <span>@{data.username}</span>
            )}
          </p>
          <div className="md:text-base text-xs font-normal text-grey felx">
            <span>دنبال کننده </span>
            <span>{data.followerCount}</span>
          </div>
        </div>
      </div>
      <ProfileDropdownShortcut user={data} />
    </div>
  )
}
