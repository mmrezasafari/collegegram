import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserRound } from 'lucide-react'
import { FollowersList } from '@/features/relationships/components/FollowersList'
import { FollowingsList } from '@/features/relationships/components/FollowingList'
import { Separator } from '@/features/common/components/ui/separator'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { useState } from 'react'
import { Button } from '@/features/common/components/ui/button'
import { EditProfileForm } from './EditProfileForm'
import type { IUser } from '@/types/user'

export const OwnProfileOverView = () => {
  const [followingsListOpen, setFollowingsListOpen] = useState(false)
  const [followersListOpen, setFollowersListOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const { data: me } = useMe()
  const user = me?.data as IUser

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-col w-full md:gap-8 gap-4">
          <div className="flex w-full items-center md:gap-8 gap-4">
            <Avatar className="md:w-[147px] md:h-[147px] w-[65px] h-[65px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
              <AvatarImage
                src={user?.imagePath}
                className="w-full h-full object-cover rounded-full"
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
                <div
                  className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1"
                  onClick={() => setFollowingsListOpen(true)}
                >
                  <span>{user?.followingCount}</span>
                  <span>دنبال‌شونده</span>
                </div>
                <Separator orientation="vertical" className="bg-black " />
                <div
                  className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1"
                  onClick={() => setFollowersListOpen(true)}
                >
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
              <div
                className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1"
                onClick={() => setFollowingsListOpen(true)}
              >
                <span>{user?.followingCount}</span>
                <span>دنبال‌شونده</span>
              </div>
              <Separator orientation="vertical" className="bg-black " />
              <div
                className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1"
                onClick={() => setFollowersListOpen(true)}
              >
                <span>{user?.followerCount}</span>
                <span>دنبال‌کننده‌</span>
              </div>
              <Separator orientation="vertical" className="bg-black " />
              <div>{user?.postCount}</div>
              <span>پست</span>
            </div>
            <p className="md:hidden w-full text-sm text-gray-400 text-justify">
              {user?.bio}
            </p>
          </div>
        </div>
        <Button
          className="max-md:w-full"
          onClick={() => setEditProfileOpen(true)}
        >
          ویرایش پروفایل
        </Button>
      </div>
      {followingsListOpen && (
        <DialogAndDrawerWizard
          open={followingsListOpen}
          setOpen={setFollowingsListOpen}
          title="دنبال شونده‌‌ها"
        >
          <FollowingsList
            onClose={() => setFollowingsListOpen(false)}
            userName={user?.username}
          />
        </DialogAndDrawerWizard>
      )}
      {followersListOpen && (
        <DialogAndDrawerWizard
          open={followersListOpen}
          setOpen={setFollowersListOpen}
          title="دنبال‌کننده‌ها"
        >
          <FollowersList
            onClose={() => setFollowersListOpen(false)}
            userName={user?.username}
          />
        </DialogAndDrawerWizard>
      )}
      {editProfileOpen && (
        <DialogAndDrawerWizard
          open={editProfileOpen}
          setOpen={setEditProfileOpen}
        >
          <EditProfileForm onSuccess={() => setEditProfileOpen(false)} />
        </DialogAndDrawerWizard>
      )}
    </>
  )
}
