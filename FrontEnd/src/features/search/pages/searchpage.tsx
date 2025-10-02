// SearchPage
import { useState } from 'react'
import { SearchBar } from '../components/SearchBar'
import type { ISearchedUsersData, ISearchTagsData } from '@/types/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Separator } from '@radix-ui/react-separator'
import { UsersGrid } from '../components/UsersGrid'
import PostsGrid from '../components/PostsGrid'

export const SearchPage = () => {
  const [defaultTab, setDefaultTab] = useState('useres')
  const [searchResults, setSearchResults] = useState<ISearchedUsersData[]>([])
  const [tagsResults, setTagsResults] = useState<ISearchTagsData[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchMore = (
    query: string,
    users: ISearchedUsersData[],
    tags?: ISearchTagsData[],
  ) => {
    setSearchQuery(query)
    setSearchResults(users)
    if (tags) {
      setTagsResults(tags)
    }
  }

  return (
    <div className="space-y-2 w-full h-full">
      {/* Search Bar */}
      <SearchBar onSearchMore={handleSearchMore} />

      {/* Tabs Section */}
      <div className="w-full h-full flex justify-center items-start bg-backgroundLight md:rounded-3xl">
        <Tabs
          value={defaultTab}
          onValueChange={setDefaultTab}
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
              value="useres"
            >
              افراد
            </TabsTrigger>
          </TabsList>

          <TabsContent value="useres" className="mt-6">
            <UsersGrid
              searchResults={searchResults}
              searchQuery={searchQuery}
            />
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            <PostsGrid searchResults={tagsResults} searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
