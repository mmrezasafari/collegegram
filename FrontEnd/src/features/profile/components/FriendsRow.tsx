import type { IFriendData } from '@/types/user'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Separator } from '@radix-ui/react-separator'
import { UserRound } from 'lucide-react'

export const FriendsRow: React.FC<IFriendData> = ({
  name,
  friendscount,
  image,
}) => {
  return (
    <div className="flex flex-col md:flex-col w-full justify-center items-center md:gap-8 gap-4">
      <div className="flex w-full items-center md:gap-8 gap-4 p-2">
        <Avatar className="md:w-[110px] md:h-[110px] w-[56px] h-[56px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
          <AvatarImage
            // src="https://github.com/shadcn.png"
            className="w-full h-full"
            alt="avatar"
          />
          <AvatarFallback className="w-[45px] md:w-[100px] h-auto">
            <UserRound
              className="w-full h-full object-cover"
              color="#A5A5A5A5"
              fill="#A5A5A5A5"
              strokeWidth={0}
            />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <p className="md:text-2xl text-xl font-bold">{name}</p>
            <p className="md:text-base text-sm font-normal">
              {/* باید از دیتای دیالوگ بخواند */}
              {friendscount} دنبال کننده
            </p>
          </div>
        </div>
        <Separator className="my-4 bg-amber-500 stroke-2" />
      </div>
    </div>
  )
}
