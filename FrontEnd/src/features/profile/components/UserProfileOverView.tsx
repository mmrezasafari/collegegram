import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import { EllipsisVertical, Plus, UserRound, Ban } from 'lucide-react'
import { FollowersList } from '@/features/relationships/components/FollowersList'
import { FollowingsList } from '@/features/relationships/components/FollowingList'
import { Separator } from '@/features/common/components/ui/separator'
import { useGetUser } from '@/features/common/hooks/users/useGetUser'
import { Button } from '@/features/common/components/ui/button'
import {
  useFollowAction,
  useUnfollowAction,
} from '@/features/relationships/hooks/useRelations'
import { useState, useRef } from 'react'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'

export const UserProfileOverView = () => {
  const [followingsListOpen, setFollowingsListOpen] = useState(false)
  const [followersListOpen, setFollowersListOpen] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const ellipsisRef = useRef<HTMLDivElement | null>(null)
  const [dialogPosition, setDialogPosition] = useState<{
    top: number
    left: number
  } | null>(null)
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

  const handleEllipsisClick = () => {
    if (ellipsisRef.current) {
      const rect = ellipsisRef.current.getBoundingClientRect()
      setDialogPosition({
        top: rect.top + window.scrollY, // align top with icon
        left: rect.right + window.scrollX + 8, // 8px to the right of icon
      })
    }
    setBlockDialogOpen(true)
  }

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
                <div
                  ref={ellipsisRef}
                  className="md:hidden cursor-pointer"
                  style={{ display: 'inline-block' }}
                >
                  <EllipsisVertical
                    color="#ea5a69"
                    onClick={handleEllipsisClick}
                  />
                </div>
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
        <div
          ref={ellipsisRef}
          className="hidden md:block cursor-pointer"
          style={{ display: 'inline-block' }}
        >
          <EllipsisVertical
            color="#ea5a69"
            size={40}
            onClick={handleEllipsisClick}
          />
        </div>
      </div>
      {followingsListOpen && (
        <DialogAndDrawerWizard
          open={followingsListOpen}
          setOpen={setFollowingsListOpen}
          title="دنبال شونده‌‌ها"
        >
          <FollowingsList onClose={() => setFollowingsListOpen(false)} />
        </DialogAndDrawerWizard>
      )}
      {followersListOpen && (
        <DialogAndDrawerWizard
          open={followersListOpen}
          setOpen={setFollowersListOpen}
          title="دنبال‌کننده‌ها"
        >
          <FollowersList onClose={() => setFollowersListOpen(false)} />
        </DialogAndDrawerWizard>
      )}
      {/* Block dialog */}
      {blockDialogOpen && dialogPosition && (
        <div
          className="fixed z-50"
          style={{
            top: dialogPosition.top,
            left: dialogPosition.left,
          }}
        >
          <div
            className="bg-white rounded-[32px] shadow-lg flex items-center justify-between px-8 py-6 min-w-[303px] min-h-[104px] cursor-default border border-gray-300"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xl font-medium">بلاک کردن</span>
            <Ban size={40} color="#222" />
          </div>
          {/* Overlay for closing */}
          <div
            className="fixed inset-0"
            style={{ zIndex: -1 }}
            onClick={() => setBlockDialogOpen(false)}
          />
        </div>
      )}
    </>
  )
}
