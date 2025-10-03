// SearchPage
import { useState } from 'react'
import { SearchBar } from '../components/SearchBar'
import type { ISearchedUserData, ISearchTagsData } from '@/types/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Separator } from '@radix-ui/react-separator'
import { UsersGrid } from '../components/UsersGrid'
import PostsGrid from '../components/PostsGrid'

export const SearchPage = () => {
  const [defaultTab, setDefaultTab] = useState<'users' | 'posts'>('users')
  const [searchResults, setSearchResults] = useState<ISearchedUserData[]>([])
  const [tagsResults, setTagsResults] = useState<ISearchTagsData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [usersError, setUsersError] = useState('')
  const [postsError, setPostsError] = useState('')

  const handleSearchMore = (
    query: string,
    users: ISearchedUserData[],
    tags?: ISearchTagsData[],
  ) => {
    setSearchQuery(query)
    setSearchResults(users)
    if (users && users.length > 0) setUsersError('')
    if (tags) setTagsResults(tags)
  }

  const handleSearchError = (message: string) => {
    // console.log('handleSearchError called:', message, 'tab:', defaultTab)
    if (defaultTab === 'users') {
      setUsersError(message)
      setPostsError('')
    } else {
      setPostsError(message)
      setUsersError('')
    }
  }

  return (
    <div className="space-y-2 w-full h-full">
      {/* Search Bar */}
      <SearchBar
        activeTab={defaultTab}
        onSearchMore={handleSearchMore}
        onSearchError={handleSearchError}
      />

      {/* Tabs Section */}
      <div className="w-full h-full flex justify-center items-start bg-backgroundLight md:rounded-3xl">
        <Tabs
          value={defaultTab}
          onValueChange={(value) => setDefaultTab(value as 'users' | 'posts')}
          className="w-full max-w-4xl display-flex"
        >
          <TabsList className="flex justify-center items-center w-full h-full gap-6 py-4 bg-transparent">
            <TabsTrigger
              className="text-[20px] rounded-none data-[state=active]:shadow-none text-grey data-[state=active]:text-black cursor-pointer px-4 py-2"
              value="posts"
            >
              پست‌ها
            </TabsTrigger>
            <Separator orientation="vertical" className="bg-black h-6" />
            <TabsTrigger
              className="text-[20px] rounded-none data-[state=active]:shadow-none text-grey data-[state=active]:text-black cursor-pointer px-4 py-2"
              value="users"
            >
              افراد
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            {usersError ? (
              <div className="text-center mt-4">{usersError}</div>
            ) : (
              <UsersGrid
                searchResults={searchResults}
                searchQuery={searchQuery}
              />
            )}
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            {postsError ? (
              <div className="text-center mt-4">{postsError}</div>
            ) : (
              <PostsGrid
                searchResults={tagsResults}
                searchQuery={searchQuery}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
