import React from 'react'
import type { ISearchedUsersData } from 'src/types/search'

interface UserSuggestionsProps {
  users: ISearchedUsersData[]
  onSelect: (_user: ISearchedUsersData) => void
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
          className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
          onMouseDown={() => onSelect(user)}
        >
          <span className="text-right">{user.firstName}</span>
          <img
            src={user.imagePath}
            alt={user.firstName}
            className="w-8 h-8 rounded-full object-cover ml-2"
          />
        </div>
      ))}
    </div>
  )
}
