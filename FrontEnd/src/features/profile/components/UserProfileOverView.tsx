import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import { EllipsisVertical, Plus, UserRound } from 'lucide-react'
import { FollowersList } from '@/features/relationships/components/FollowersList'
import { FollowingsList } from '@/features/relationships/components/FollowingList'
import { Separator } from '@/features/common/components/ui/separator'
import { useGetUser } from '@/features/common/hooks/users/useGetUser'
import { Button } from '@/features/common/components/ui/button'
import {
  useFollowAction,
  useUnfollowAction,
} from '@/features/relationships/hooks/useRelations'
import { useState } from 'react'
import { DialogAndModalWizard } from '@/features/common/components/layout/DialogAndModalWizard'

export const UserProfileOverView = () => {
  const [followingsListOpen, setFollowingsListOpen] = useState(false)
  const [followersListOpen, setFollowersListOpen] = useState(false)
  const { data } = useGetUser()
  const user = data?.data
  const { mutate: unFollowMutation } = useUnfollowAction()
  const { mutate: followMutation } = useFollowAction()

  const handleFollow = () => {
    followMutation()
  }

  const handleUnFollow = () => {
    unFollowMutation()
  }

  return (
    <>
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
            <div className="flex max-md:w-full flex-col gap-4">
              <div className="flex items-center max-md:justify-between gap-4">
                <div className="flex items-center gap-2 md:gap-4">
                  <p className="md:text-2xl font-bold text-wrap text-justify">
                    <span>{user?.firstName} </span>
                    <span>{user?.lastName}</span>
                  </p>
                  <p className="md:text-base text-sm font-light">
                    <span>{user?.username}</span>
                    <span>@</span>
                  </p>
                </div>
                <div className="max-md:hidden">
                  {user?.isFollowing ? (
                    <Button
                      className="flex w-[150px]"
                      variant="outline"
                      onClick={handleUnFollow}
                    >
                      <span>دنبال نکردن</span>
                    </Button>
                  ) : (
                    <Button
                      className="flex w-[150px]"
                      variant="default"
                      onClick={handleFollow}
                    >
                      <Plus />
                      <span>دنبال کردن</span>
                    </Button>
                  )}
                </div>
                <EllipsisVertical className="md:hidden" color="#ea5a69" />
              </div>
              <div className="hidden md:flex space-x-4 items-center h-4">
                <div className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1" onClick={() => setFollowingsListOpen(true)}>
                  <span>{user?.followingCount}</span>
                  <span>دنبال‌شونده</span>
                </div>
                <Separator orientation="vertical" className="bg-black " />
                <div className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1" onClick={() => setFollowersListOpen(true)}>
                  <span>{user?.followerCount}</span>
                  <span>دنبال‌کننده‌</span>
                </div>
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
              <div className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1" onClick={() => setFollowingsListOpen(true)}>
                <span>{user?.followingCount}</span>
                <span>دنبال‌شونده</span>
              </div>
              <Separator orientation="vertical" className="bg-black " />
              <div className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1" onClick={() => setFollowersListOpen(true)}>
                <span>{user?.followerCount}</span>
                <span>دنبال‌کننده‌</span>
              </div>
              <Separator orientation="vertical" className="bg-black " />
              <div className="flex gap-2">
                <span>{user?.postCount}</span>
                <span>پست</span>
              </div>
            </div>
            <p className="md:hidden w-full text-sm text-gray-400 text-justify">
              {user?.bio}
            </p>
            <div className="md:hidden flex">
              {user?.isFollowing ? (
                <Button
                  className="flex w-full"
                  variant="outline"
                  onClick={handleUnFollow}
                >
                  <span>دنبال نکردن</span>
                </Button>
              ) : (
                <Button
                  className="flex w-full"
                  variant="default"
                  onClick={handleFollow}
                >
                  <Plus />
                  <span>دنبال کردن</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        <EllipsisVertical className="hidden md:block cursor-pointer" color="#ea5a69" size={40} />
      </div>
      {
        followingsListOpen &&
        <DialogAndModalWizard open={followingsListOpen} setOpen={setFollowingsListOpen} title="دنبال شونده‌‌ها">
          <FollowingsList onClose={() => setFollowingsListOpen(false)} />
        </DialogAndModalWizard>
      }
      {
        followersListOpen &&
        <DialogAndModalWizard open={followersListOpen} setOpen={setFollowersListOpen} title="دنبال‌کننده‌ها">
          <FollowersList onClose={() => setFollowersListOpen(false)} />
        </DialogAndModalWizard>
      }
    </>
  )
}
