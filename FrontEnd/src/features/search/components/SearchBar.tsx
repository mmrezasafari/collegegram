import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  ISearchUserGetRes,
  ISearchTagsGetRes,
  ISearchedUsersData,
  ISearchTagsData,
} from 'src/types/search'
import api from '@/lib/axios'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { PostDetails } from '@/features/post/components/PostDetails'
import { UserSuggestions } from './UserSuggestions'
import { TagSuggestions } from './TagSuggestions'
import { useDebounce } from '../hooks/useDebounce'

const fetchUser = async (query: string) => {
  const res = await api.get<ISearchUserGetRes>(
    `search/users?offset=0&limit=90&sort=ASC&search=${query}&isSummary=false`,
  )
  return res.data.data
}

const fetchTags = async (query: string) => {
  const res = await api.get<ISearchTagsGetRes>(
    `search/tags?offset=0&limit=10&sort=ASC&search=${query}&isSummary=false`,
  )
  return res.data.data
}

interface SearchBarProps {
  activeTab?: 'users' | 'posts'
  onSearchMore?: (
    // eslint-disable-next-line no-unused-vars
    query: string,
    // eslint-disable-next-line no-unused-vars
    users: ISearchedUsersData[],
    // eslint-disable-next-line no-unused-vars
    tags?: ISearchTagsData[],
  ) => void
  onSearchError?: (message: string) => void
}

export const SearchBar = ({
  activeTab,
  onSearchMore,
  onSearchError,
}: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  // Debounce the query with 300ms delay after first character
  const debouncedQuery = useDebounce(query, query.length > 0 ? 300 : 0)

  const Users = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: ({ queryKey }) => fetchUser(queryKey[1] as string),
    enabled: debouncedQuery.trim().length > 0,
  })

  const Tags = useQuery({
    queryKey: ['tags', debouncedQuery],
    queryFn: ({ queryKey }) => fetchTags(queryKey[1] as string),
    enabled: debouncedQuery.trim().length > 0,
  })

  const getCurrentTab = useCallback(() => {
    return activeTab || 'users'
  }, [activeTab])

  const isTabActive = useCallback(
    (tabName: 'users' | 'posts') => {
      return getCurrentTab() === tabName
    },
    [getCurrentTab],
  )

  // Track last error to avoid repeated/conflicting error messages
  const [lastError, setLastError] = useState<string | null>(null)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      if (lastError) {
        setLastError(null)
        onSearchError?.('') // Clear error when query is empty
      }
      return
    }
    let errorMsg = null
    if (isTabActive('users')) {
      if (Users.data && Users.data.length === 0) {
        errorMsg = 'شخصی با این نام یافت نشد.'
      }
    } else if (isTabActive('posts')) {
      if (Tags.data && Tags.data.length === 0) {
        errorMsg = 'این کلمه تا به حال تگ نشده.'
      }
    }
    if (errorMsg !== lastError) {
      setLastError(errorMsg)
      onSearchError?.(errorMsg || '')
    }
    // Clear error if results are found
    if (
      (isTabActive('users') && Users.data && Users.data.length > 0) ||
      (isTabActive('posts') && Tags.data && Tags.data.length > 0)
    ) {
      if (lastError) {
        setLastError(null)
        onSearchError?.('')
      }
    }
  }, [
    debouncedQuery,
    Users.data,
    Tags.data,
    activeTab,
    isTabActive,
    onSearchError,
    lastError,
  ])

  const onToggleMore = () => {
    if (isTabActive('users')) {
      if (Users.data && Users.data.length > 0 && onSearchMore) {
        onSearchMore(debouncedQuery, Users.data, Tags.data || [])
        setShowSuggestions(false)
      } else {
        onSearchError?.('شخصی با این نام یافت نشد')
        if (Tags.data && Tags.data.length > 0 && onSearchMore) {
          onSearchMore(debouncedQuery, [], Tags.data)
          setShowSuggestions(false)
        }
      }
    } else if (isTabActive('posts')) {
      if (Tags.data && Tags.data.length > 0 && onSearchMore) {
        onSearchMore(debouncedQuery, Users.data || [], Tags.data)
        setShowSuggestions(false)
      } else {
        onSearchError?.('این کلمه تا به حال تگ نشده')
        if (Users.data && Users.data.length > 0 && onSearchMore) {
          onSearchMore(debouncedQuery, Users.data, Tags.data || [])
          setShowSuggestions(false)
        }
      }
    }
  }

  return (
    <>
      <div className="w-full flex flex-col items-center relative">
        <div className="flex items-center bg-white rounded-full px-6 py-3 w-[400px] md:w-[600px] shadow-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onToggleMore()
              }
            }}
            placeholder="جستجو در افراد، تگ‌ها، واژه‌ها و ..."
            className="bg-transparent border-none outline-none text-gray-500 text-md pr-6 w-full text-right"
            dir="rtl"
          />
          <svg
            className="w-7 h-7 text-gray-500 ml-2 cursor-pointer"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            onClick={onToggleMore}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        {showSuggestions &&
          ((Users.data?.length ?? 0) > 0 || (Tags.data?.length ?? 0) > 0) && (
            <div className="absolute top-full mt-2 w-[400px] md:w-[600px] bg-white rounded-2xl shadow-lg z-10">
              <UserSuggestions
                users={(Users.data ?? []).slice(0, 3)}
                // searchQuery={query}
                onSelect={(user) => {
                  setQuery(user.username)
                  window.location.href = `/profile/${user.username}`
                }}
              />
              <TagSuggestions
                tags={(Tags.data ?? []).slice(0, 4)}
                // searchQuery={query}
                onTagSelect={(tag) => {
                  setQuery(tag.caption)
                  setPostModalOpen(true)
                  setPostId(tag.id)
                }}
              />

              <button
                className="bg-[#F46B82] text-white rounded-full px-6 py-2 font-bold text-lg mt-2 absolute left-6 cursor-pointer hover:bg-primary"
                onClick={onToggleMore}
              >
                بیشتر
              </button>
              <div className="border-t border-gray-200 my-2 mx-6" />
            </div>
          )}
      </div>
      {postModalOpen && (
        <DialogAndDrawerWizard
          open={postModalOpen}
          setOpen={setPostModalOpen}
          className="h-[95%] md:max-w-full md:w-[1250px] md:h-[730px] flex flex-col md:px-12"
        >
          <PostDetails postId={postId} />
        </DialogAndDrawerWizard>
      )}
    </>
  )
}
