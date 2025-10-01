import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import {
  EllipsisVertical,
  Plus,
  UserRound,
  UserLock,
  UserRoundPlus,
} from 'lucide-react'
import { FollowersList } from '@/features/relationships/components/FollowersList'
import { FollowingsList } from '@/features/relationships/components/FollowingList'
import { Separator } from '@/features/common/components/ui/separator'
import { useGetUser } from '@/features/common/hooks/users/useGetUser'
import { Button } from '@/features/common/components/ui/button'
import {
  useAddToCloseFriends,
  useFollowAction,
  useUnfollowAction,
} from '@/features/relationships/hooks/useRelationsActions'
import { useState } from 'react'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { useGetRelationStatus } from '@/features/relationships/hooks/useRelations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/common/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import type { IUser } from '@/types/user'

export const UserProfileOverView = () => {
  const { data } = useGetUser()
  const user = data?.data as IUser
  const { data: relationStatus } = useGetRelationStatus(user?.username)
  const followStatus = relationStatus?.data
  const [followingsListOpen, setFollowingsListOpen] = useState(false)
  const [followersListOpen, setFollowersListOpen] = useState(false)
  const { mutate: unFollowMutation } = useUnfollowAction(user?.username)
  const { mutate: followMutation } = useFollowAction(user?.username)
  const { mutate: addToCloseFriendsMutation } = useAddToCloseFriends(user)

  const handleFollow = () => {
    followMutation()
  }

  const handleUnFollow = () => {
    unFollowMutation()
  }

  const onAddToCloseFriends = () => {
    console.log(user)
    addToCloseFriendsMutation()
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
            <div className="flex max-md:w-full flex-col gap-4 w-full">
              <div className="flex items-center max-md:justify-between gap-4 w-full justify-between">
                <div className="flex gap-4 items-center">
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
                    {user?.isFollowing &&
                    followStatus?.status === 'ACCEPTED' ? (
                      <Button
                        className="flex w-[150px]"
                        variant="outline"
                        onClick={handleUnFollow}
                      >
                        <span>دنبال نکردن</span>
                      </Button>
                    ) : followStatus && followStatus?.status === 'PENDING' ? (
                      <Button
                        className="flex w-[150px]"
                        variant="outline"
                        onClick={handleUnFollow}
                      >
                        <span>لغو در‌خواست</span>
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
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <EllipsisVertical color="#ea5a69" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="border bg-light border-geryLight rounded-4xl rounded-tl-none ml-4"
                    align="start"
                  >
                    <DropdownMenuGroup className="flex flex-col gap-2 p-2">
                      <DropdownMenuItem className="rounded-full py-4 px-6">
                        <Link to={'/close-friends'}>
                          <div className="flex  gap-4 text-base">
                            <span>بلاک کردن</span>
                            <UserLock />
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-full py-4 px-6"
                        onClick={onAddToCloseFriends}
                      >
                        <button className="w-full h-full cursor-pointer rounded-4xl">
                          <div className="flex justify-end gap-4 text-base">
                            <span>افزودن به دوستان نزدیک</span>
                            <UserRoundPlus />
                          </div>
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="hidden md:flex space-x-4 items-center h-4">
                <div
                  className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1"
                  onClick={() =>
                    (user.isFollowing || !user.isPrivate) &&
                    setFollowingsListOpen(true)
                  }
                >
                  <span>{user?.followingCount}</span>
                  <span>دنبال‌شونده</span>
                </div>
                <Separator orientation="vertical" className="bg-black " />
                <div
                  className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1"
                  onClick={() =>
                    (user.isFollowing || !user.isPrivate) &&
                    setFollowersListOpen(true)
                  }
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
              {user?.isFollowing && followStatus?.status === 'ACCEPTED' ? (
                <Button
                  className="flex w-full"
                  variant="outline"
                  onClick={handleUnFollow}
                >
                  <span>دنبال نکردن</span>
                </Button>
              ) : (followStatus && followStatus?.status) === 'PENDING' ? (
                <Button
                  className="flex w-full"
                  variant="default"
                  onClick={handleUnFollow}
                >
                  <span>لغو در‌خواست</span>
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
      </div>
      {followingsListOpen && (
        <DialogAndDrawerWizard
          open={followingsListOpen}
          setOpen={setFollowingsListOpen}
          title="دنبال شونده‌‌ها"
        >
          <FollowingsList
            onClose={() => setFollowingsListOpen(false)}
            userName={user.username}
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
            userName={user.username}
          />
        </DialogAndDrawerWizard>
      )}
    </>
  )
}
