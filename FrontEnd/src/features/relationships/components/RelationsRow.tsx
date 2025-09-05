import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { EllipsisVertical, UserRound } from 'lucide-react'

interface IProps {
  name: string
  followerCount: number
  image: string
}

// TODO: replace userName to firstName and lastName

export const RelationsRow = ({ name, followerCount, image }: IProps) => {
  return (
    <div className="flex flex-row-reverse w-full justify-between items-center">
      <div className="flex flex-row-reverse items-center gap-4">
        <Avatar className="w-[56px] h-[56px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
          <AvatarImage src={image} className="w-full h-full" alt="avatar" />
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
          <p className="md:text-base text-sm font-bold">{name}</p>
          <p className="md:text-base text-xs font-normal text-grey">
            <span>دنبال کننده </span>
            <span>{followerCount}</span>
          </p>
        </div>
      </div>
      <EllipsisVertical color="#ea5a69" />
    </div>
  )
}
