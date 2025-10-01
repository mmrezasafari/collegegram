import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/common/components/ui/dropdown-menu'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import type { ICloseFriend, IFollower, IFollowing } from '@/types/relations'
import { EllipsisVertical, User, UserRoundMinus } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  useRemoveFollower,
  useRemoveFromCloseFriends,
  useUnfollowAction,
} from '../hooks/useRelationsActions'
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
import type { IUser } from '@/types/user'

interface IProps {
  mode: 'followers' | 'followings' | 'closeFriends' | 'blockList'
  user: IFollower | IFollowing | ICloseFriend | IUser
}

export const RelationsRowDropdownShortcut = ({ user, mode }: IProps) => {
  const { data: me } = useMe()
  const { mutate: unFollowAction } = useUnfollowAction(user.username)
  const { mutate: removeFollower } = useRemoveFollower(user.username)
  const { mutate: removeFromCloseFriends } = useRemoveFromCloseFriends(
    user as IUser,
  )

  const handleUnfollow = () => {
    unFollowAction()
  }

  const handleRemove = () => {
    removeFollower()
  }

  const handleRemoveFromCloseFriends = () => {
    removeFromCloseFriends()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <EllipsisVertical color="#ea5a69" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ml-4 rounded-4xl rounded-tl-none border border-geryLight p-4"
        align="start"
      >
        <DropdownMenuLabel hidden></DropdownMenuLabel>
        <DropdownMenuGroup className="flex flex-col gap-2">
          <DropdownMenuItem className="rounded-4xl w-full">
            {user.username === me?.data?.username ? (
              <Link className="w-full h-full px-2" to={`/profile`}>
                <div className="flex gap-2 justify-end">
                  <span>مشاهده پروفایل</span>
                  <User />
                </div>
              </Link>
            ) : (
              <Link
                className="w-full h-full px-2"
                to={`/profile/${user.username}`}
              >
                <div className="flex gap-2 justify-end">
                  <span>مشاهده پروفایل</span>
                  <User />
                </div>
              </Link>
            )}
          </DropdownMenuItem>
          {user.username !== me?.data.username && (
            <>
              {mode === 'followings' && (
                <DropdownMenuItem className="rounded-4xl">
                  <button
                    className="w-full h-full cursor-pointer px-2 rounded-4xl"
                    onClick={handleUnfollow}
                  >
                    <div className="flex gap-2 justify-end">
                      <span>حذف از دنبال‌شونده‌</span>
                      <UserRoundMinus />
                    </div>
                  </button>
                </DropdownMenuItem>
              )}
              {mode === 'followers' && (
                <DropdownMenuItem className="rounded-4xl">
                  <button
                    className="w-full h-full cursor-pointer px-2 rounded-4xl"
                    onClick={handleRemove}
                  >
                    <div className="flex gap-2 justify-end">
                      <span>حذف از دنبال‌کننده‌ها</span>
                      <UserRoundMinus />
                    </div>
                  </button>
                </DropdownMenuItem>
              )}
            </>
          )}
          {mode === 'closeFriends' && (
            <DropdownMenuItem className="rounded-4xl">
              <button
                className="w-full h-full cursor-pointer px-2 rounded-4xl"
                onClick={handleRemoveFromCloseFriends}
              >
                <div className="flex gap-2 justify-end">
                  <span>حذف از دوستان نزدیک</span>
                  <UserRoundMinus />
                </div>
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
