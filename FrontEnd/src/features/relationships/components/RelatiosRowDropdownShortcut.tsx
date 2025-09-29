import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/common/components/ui/dropdown-menu'
import type { ICloseFriend, IFollower, IFollowing } from '@/types/relations'
import { EllipsisVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/lib/axios'

export const RelationsRowDropdownShortcut = (user: {
  user: IFollower | IFollowing | ICloseFriend
}) => {
  const data = user?.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <EllipsisVertical color="#ea5a69" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border border-geryLight w-64 rounded-4xl"
        align="center"
      >
        <DropdownMenuGroup className="flex flex-col gap-2 py-6 px-1">
          <DropdownMenuItem className="rounded-full px-8 py-4">
            <Link to={`/profile/${data.username}`}>
              <div className="flex items-start gap-4 text-base">
                <span>مشاهده پروفایل</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-full px-8 py-4 cursor-pointer"
            onClick={async () => {
              try {
                await api.delete(`/users/${data.username}/close-friends`)
                // Refresh just the current tab content by triggering a re-render
                window.dispatchEvent(new CustomEvent('refreshCloseFriends'))
              } catch (error) {
                console.error('Error removing from close friends:', error)
              }
            }}
          >
            <div className="flex items-start gap-4 text-base">
              <span>حذف از دوستان نزدیک</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-full px-8 py-4">
            <Link to={`/profile/${data.username}`}>
              <div className="flex items-start gap-4 text-base">
                <span>بلاک کردن</span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
