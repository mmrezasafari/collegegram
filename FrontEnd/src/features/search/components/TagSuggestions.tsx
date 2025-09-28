import React from 'react'
import type { ISearchTagsData } from 'src/types/search'

interface TagSuggestionsProps {
  tags: ISearchTagsData[]
  onTagSelect: (tag: ISearchTagsData) => void
}

export const TagSuggestions: React.FC<TagSuggestionsProps> = ({
  tags,
  onTagSelect,
}) => {
  if (!tags || tags.length === 0) return null

  return (
    <div className="px-6 pb-4 relative">
      {tags.map((tag, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
          onMouseDown={() => onTagSelect(tag)}
        >
          <span className="text-right w-full">{tag.caption}</span>
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
