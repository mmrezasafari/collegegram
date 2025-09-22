import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useUsersSearch } from '../hooks/useSearch'
import { UserCard } from './UserCard'

export const UsersGrid = () => {
  const { users, isLoading } = useUsersSearch(0, 50, 'ASC', '', false)
  const usersData = users?.data ?? []

  return (
    <ScrollArea className="h-[800px]">
      <div
        className="flex flex-wrap justify-center gap-4 overflow-y-auto h-full"
        dir="rtl"
      >
        {isLoading}
        {usersData.map((user) => (
          <UserCard
            key={user.username}
            name={user.username}
            followerCount={user.followerCount ?? 0}
            avatar={user.imagePath}
            isFollowing={user.isFollowing}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
