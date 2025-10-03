import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserRound } from 'lucide-react'
import React from 'react'
import type { ISearchedUserData } from 'src/types/search'

interface UserSuggestionsProps {
  users: ISearchedUserData[]
  onSelect: (_user: ISearchedUserData) => void
  // onSelect: () => void
}

export const UserSuggestions: React.FC<UserSuggestionsProps> = ({
  users,
  onSelect,
}) => {
  if (!users || users.length === 0) return null

  return (
    <div className="px-6 pt-4 pb-2 relative">
      {users.map((user, idx) => (
        <div
          key={idx}
          className="flex items-center py-2 cursor-pointer hover:bg-gray-100"
          onMouseDown={() => onSelect(user)}
        >
          <Avatar className="w-[32px] h-[32px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
            <AvatarImage
              src={user?.imagePath}
              className="w-full h-full object-cover rounded-full"
              alt="avatar"
            />
            <AvatarFallback className="w-[32px] h-[32px]">
              <UserRound
                className="w-[32px] h-auto object-cover"
                color="#A5A5A5A5"
                fill="#A5A5A5A5"
                strokeWidth={0}
              />
            </AvatarFallback>
          </Avatar>
          <span className="text-right px-2">{user.username}</span>
        </div>
      ))}
    </div>
  )
}
