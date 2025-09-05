import { Separator } from '@/features/common/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserRound } from 'lucide-react'
import * as React from 'react'
import { EditProfileWizard } from '../components/EditProfileWizard'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import { PostArea } from '@/features/post/components/PostArea'
import { FollowersList } from '@/features/relationships/components/FollowersList'
import { FollowingsList } from '@/features/relationships/components/FollowingList'

export function ProfilePage(): React.ReactElement {
  const { data: me } = useMe()
  const user = me?.data

  return (
    <div className="h-full flex flex-col md:gap-8 gap-4">
      <h2 className="md:text-2xl text-xl font-bold">صفحه من</h2>
      {/* TODO: seperate this to a component */}
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
              <div className="flex items-center gap-4">
                <p className="md:text-2xl text-xl font-bold text-wrap text-justify">
                  <span>{user?.firstName} </span>
                  <span>{user?.lastName}</span>
                </p>
                <p className="md:text-base text-sm font-normal flex-1/3">
                  <span>{user?.username}</span>
                  <span>@</span>
                </p>
              </div>
              <div className="hidden md:flex space-x-4 items-center h-4">
                <FollowingsList />
                <Separator orientation="vertical" className="w-1 bg-black " />
                <FollowersList />
                <Separator orientation="vertical" className="w-1 bg-black " />
                <div>۱۹ پست</div>
              </div>
              <p className="hidden md:block text-base text-gray-400 text-justify">
                {user?.bio}
              </p>
            </div>
          </div>
          <div className="md:hidden flex flex-col gap-4">
            <div className="flex space-x-6 justify-center">
              <FollowingsList />
              <Separator orientation="vertical" className="w-1 bg-black " />
              <FollowersList />
              <Separator orientation="vertical" className="w-1 bg-black " />
              <div>۱۹ پست</div>
            </div>
            <p className="md:hidden w-full text-sm text-gray-400 text-justify">
              {user?.bio}
            </p>
          </div>
        </div>
        <EditProfileWizard />
      </div>
      <Separator className="bg-geryLight" />
      <PostArea />
    </div>
  )
}
