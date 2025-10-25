import { Separator } from '@/features/common/components/ui/separator'
import { cn } from '@/lib/utils'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

export const FriendsAndBlockedTab = () => {
  const location = useLocation()

  return (
    <div className="flex flex-row items-center gap-4">
      <Link
        className={cn(
          'text-gray-400 font-medium text-xl',
          location.pathname === '/close-friends' && 'text-black',
        )}
        to={'/close-friends'}
      >
        دوستان نزدیک
      </Link>
      <Separator
        orientation="vertical"
        className="border border-gray-400 !h-5"
      />
      <Link
        className={cn(
          'text-gray-400 font-md text-xl',
          location.pathname === '/block-list' && 'text-black',
        )}
        to={'/block-list'}
      >
        لیست سیاه
      </Link>
    </div>
  )
}
