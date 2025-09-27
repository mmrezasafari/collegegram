import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import type { ICloseFriend } from '@/types/relations'
import { UserRound } from 'lucide-react'

export const UserRow = (user: { user: ICloseFriend }) => {
  const data = user?.user
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex flex-row-reverse items-center gap-4">
        <div className="flex flex-col gap-2">
          <p className="md-text-base text-sm font-bold">
            {data.firstname ? (
              <>
                <span>{data.firstname}</span>
                <span>{data.lastname}</span>
              </>
            ) : (
              <span>{data.username}</span>
            )}
          </p>
          <div className="md:text-base text-xs font-normal text-gray flex">
            {/* Should get follower count from other data */}
            {/* <span>{data.followerCount} </span>
            <span> دنبال کننده </span> */}
          </div>
        </div>
        <Avatar className="w-[56px] h-[56px] border border-grayLight flex justify-center items-center rounded-full bg-grayVeryLight">
          <AvatarImage
            src={data.imageUrl}
            className="w-full h-full object-cover"
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
      </div>
    </div>
  )
}
