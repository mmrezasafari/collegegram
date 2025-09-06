import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserRound } from 'lucide-react'
import { EditProfileWizard } from './EditProfileWizard'
import { FollowersList } from '@/features/relationships/components/FollowersList'
import { FollowingsList } from '@/features/relationships/components/FollowingList'
import { Separator } from '@/features/common/components/ui/separator'
import { useMe } from '@/features/common/hooks/users/useGetMe'

export const OwnProfileOverView = () => {
  const { data: me } = useMe()
  const user = me?.data

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col md:flex-col w-full md:gap-8 gap-4">
        <div className="flex w-full items-center md:gap-8 gap-4">
          <Avatar className="md:w-[147px] md:h-[147px] w-[65px] h-[65px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
            <AvatarImage className="w-full h-full" alt="avatar" />
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
            <div className="flex items-center gap-2">
              <p className="md:text-2xl font-bold text-wrap text-justify">
                <span>{user?.firstName} </span>
                <span>{user?.lastName}</span>
              </p>
              <p className="md:text-base text-sm font-light">
                <span>{user?.username}</span>
                <span>@</span>
              </p>
            </div>
            <div className="hidden md:flex space-x-4 items-center h-4">
              <FollowingsList />
              <Separator orientation="vertical" className="bg-black " />
              <FollowersList />
              <Separator orientation="vertical" className="bg-black " />
              <div className="flex gap-2">
                <span>{user?.postCount}</span>
                <span>پست</span>
              </div>
            </div>
            <p className="hidden md:block text-base text-gray-400 text-justify">
              {user?.bio}
            </p>
          </div>
        </div>
        <div className="md:hidden flex flex-col gap-4">
          <div className="flex space-x-4 justify-center h-4">
            <FollowingsList />
            <Separator orientation="vertical" className="bg-black " />
            <FollowersList />
            <Separator orientation="vertical" className="bg-black " />
            <div>۱۹ پست</div>
          </div>
          <p className="md:hidden w-full text-sm text-gray-400 text-justify">
            {user?.bio}
          </p>
        </div>
      </div>
      <EditProfileWizard />
    </div>
  )
}
