import { useState } from 'react'
import { SearchBar } from '../components/SearchBar'
import TabsBar from '../components/TabBar'
import { UsersGrid } from '../components/UsersGrid'
import PostsGrid from '../components/PostsGrid'
import type { ISearchedUsersData, ISearchTagsData } from '@/types/search'

export const SearchPage = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users')
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
    <>
      {/* Search Bar */}
      <SearchBar activeTab={activeTab} onSearchMore={handleSearchMore} />
      {/* TabsBar */}
      <TabsBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">
        {activeTab === 'users' ? (
          <UsersGrid searchResults={searchResults} searchQuery={searchQuery} />
        ) : (
          <PostsGrid searchResults={tagsResults} searchQuery={searchQuery} />
        )}
      </div>
    </>
  )
}
