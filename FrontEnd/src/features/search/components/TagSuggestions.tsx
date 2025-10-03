import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserRound } from 'lucide-react'
import React from 'react'
import type { ISearchTagsData } from 'src/types/search'

interface TagSuggestionsProps {
  tags: ISearchTagsData[]
  onTagSelect: (_tag: ISearchTagsData) => void
}

function getHashtaggedWords(text: string): string {
  // Match words starting with #, followed by letters, numbers, or underscores
  const matches = text.match(/#[\w\u0600-\u06FF]+/g) || []
  return matches.join(' ')
}

export const TagSuggestions: React.FC<TagSuggestionsProps> = ({
  tags,
  onTagSelect,
}) => {
  if (!tags || tags.length === 0) return null

  const handleTagSelect = (tag: ISearchTagsData) => {
    onTagSelect(tag)
  }

  return (
    <div className="px-6 pb-4 relative">
      {tags.map((tag, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
          onMouseDown={() => handleTagSelect(tag)}
        >
          <Avatar className="w-[32px] h-[32px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
            <AvatarImage
              src={tag.images[0]?.url}
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
          <span className="text-right w-full px-2">
            {getHashtaggedWords(tag.caption)}
          </span>
          <svg
            className="w-5 h-5 text-gray-500 ml-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      ))}
    </div>
  )
}
