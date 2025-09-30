import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/common/components/ui/dropdown-menu'
import { useMe } from '@/features/common/hooks/users/useGetMe'
import type { ICloseFriend, IFollower, IFollowing } from '@/types/relations'
import { EllipsisVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  useRemoveFollower,
  useUnfollowAction,
} from '../hooks/useRelationsActions'
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'

interface IProps {
  mode: 'followers' | 'followings' | 'closeFriends' | 'blockList'
  user: IFollower | IFollowing | ICloseFriend
}

export const RelationsRowDropdownShortcut = ({ user, mode }: IProps) => {
  const { data: me } = useMe()
  const { mutate: unFollowAction } = useUnfollowAction(user.username)
  const { mutate: removeFollower } = useRemoveFollower(user.username)

  const handleUnfollow = () => {
    unFollowAction()
  }

  const handleRemove = () => {
    removeFollower()
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
        <DropdownMenuGroup className="flex flex-col gap-2 text-end">
          <DropdownMenuItem className="rounded-4xl">
            {user.username === me?.data?.username ? (
              <Link className="w-full h-full px-2" to={`/profile`}>
                مشاهده پروفایل
              </Link>
            ) : (
              <Link
                className="w-full h-full px-2"
                to={`/profile/${user.username}`}
              >
                مشاهده پروفایل
              </Link>
            )}
          </DropdownMenuItem>
          {user.username !== me?.data.username && (
            <DropdownMenuItem className="rounded-4xl">
              {mode === 'followings' && (
                <button
                  className="w-full h-full cursor-pointer px-2 rounded-4xl"
                  onClick={handleUnfollow}
                >
                  حذف از دنبال‌شونده‌
                </button>
              )}
              {mode === 'followers' && (
                <button
                  className="w-full h-full cursor-pointer px-2 rounded-4xl"
                  onClick={handleRemove}
                >
                  حذف از دنبال‌کننده‌ها
                </button>
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
