import { useState } from 'react'
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

const fetchUser = async (query: string) => {
  const res = await api.get<ISearchUserGetRes>(
    `search/users?offset=0&limit=90&sort=ASC&search=${query}&isSummary=true`,
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
    query: string,
    users: ISearchedUsersData[],
    tags?: ISearchTagsData[],
  ) => void
}

export const SearchBar = ({ activeTab, onSearchMore }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  const Users = useQuery({
    queryKey: ['search', query],
    queryFn: ({ queryKey }) => fetchUser(queryKey[1] as string),
    enabled: query.trim().length > 0,
  })

  const Tags = useQuery({
    queryKey: ['tags', query],
    queryFn: ({ queryKey }) => fetchTags(queryKey[1] as string),
    enabled: query.trim().length > 0,
  })

  const getCurrentTab = () => {
    return activeTab || 'users'
  }

  const isTabActive = (tabName: 'users' | 'posts') => {
    return getCurrentTab() === tabName
  }

  const onToggleMore = () => {
    if (isTabActive('users')) {
      if (Users.data && Users.data.length > 0 && onSearchMore) {
        onSearchMore(query, Users.data, Tags.data || [])
        setShowSuggestions(false)
      } else {
        alert('شخصی با این نام یافت نشد.')
      }
    } else if (isTabActive('posts')) {
      if (Tags.data && Tags.data.length > 0 && onSearchMore) {
        onSearchMore(query, Users.data || [], Tags.data)
        setShowSuggestions(false)
      } else {
        alert('این کلمه تا به حال تگ نشده.')
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
              {/* User Suggestions ***************************************************************************/}
              <UserSuggestions
                users={(Users.data ?? []).slice(0, 3)}
                onSelect={(user) => {
                  setQuery(user.firstName)
                  window.location.href = `/profile/${user.firstName}`
                }}
              />
              {/* Tag Suggestions ***************************************************************************/}
              <TagSuggestions
                tags={(Tags.data ?? []).slice(0, 4)}
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
              {/* Divider */}
              <div className="border-t border-gray-200 my-2 mx-6" />
              {/* Search Suggestions */}
              {/* {filteredSearchSuggestions.length > 0 && (
                <div className="px-6 pb-4">
                  {filteredSearchSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => setQuery(s)}
                    >
                      <span className="text-right w-full">{s}</span>
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
              )} */}
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
