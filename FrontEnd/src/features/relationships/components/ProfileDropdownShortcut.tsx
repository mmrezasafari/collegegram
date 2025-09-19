import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/features/common/components/ui/dropdown-menu'
import type { IFollower, IFollowing } from '@/types/relations'
import { EllipsisVertical } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ProfileDropdownShortcut = (user: {
  user: IFollower | IFollowing
}) => {
  const data = user?.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <EllipsisVertical color="#ea5a69" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-" align="start">
        <DropdownMenuLabel hidden></DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to={`/profile/${data.username}`}>مشاهده پروفایل</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
