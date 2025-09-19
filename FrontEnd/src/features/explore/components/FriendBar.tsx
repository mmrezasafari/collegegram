import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserRound } from 'lucide-react'

interface FriendBarProps {
  firstName: string
  lastName: string
  followCount: number
  avatarUrl: string
}

const FriendBar = ({
  firstName,
  lastName,
  followCount,
  avatarUrl,
}: FriendBarProps) => {
  return (
    <div className="flex items-center w-full pb-4 gap-4">
      <Avatar className="flex justify-center items-center w-[35px] h-[35px] rounded-full">
        <AvatarImage
          src={avatarUrl}
          className="w-full h-full object-cover object-center scale-160 rounded-full"
          alt="avatar"
        />
        <AvatarFallback className="flex justify-center items-center w-full h-full bg-geryLight rounded-full">
          <UserRound color="#A5A5A5" strokeWidth={1.5} />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p className="font-bold text-[#222]">
          <span>{firstName} </span>
          <span>{lastName}</span>
        </p>
        <p className="flex text-[#222] text-gray font-normal text-xs gap-1">
          <span>{followCount}</span>
          <span>دنبال‌کننده</span>
        </p>
      </div>
    </div>
  )
}

export default FriendBar
