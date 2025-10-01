import { useInfiniteSearch } from '../hooks/useSearch'
import { UserCard } from './UserCard'
import { useEffect, useRef } from 'react'
import type { ISearchedUsersData } from '@/types/search'

interface UsersGridProps {
  searchResults?: ISearchedUsersData[]
  searchQuery?: string
}

export const UsersGrid = ({ searchResults }: UsersGridProps) => {
  const { allUsers, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteSearch()

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (!hasNextPage || isFetchingNextPage) return

      const { scrollTop, scrollHeight, clientHeight } = container

      console.log(scrollTop + clientHeight >= scrollHeight - 50)

      // Trigger fetch when scrolled to bottom (or within 50px)
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        fetchNextPage()
      }
    }

    container.addEventListener('scroll', handleScroll)

    return () => container.removeEventListener('scroll', handleScroll)
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Use search results if provided, otherwise use infinite scroll data
  const usersToDisplay =
    searchResults && searchResults.length > 0 ? searchResults : allUsers || []
  const showLoadingState =
    !searchResults && isFetchingNextPage && !allUsers?.length
  const showLoadingMore = !searchResults && isFetchingNextPage

  return (
    <div className="flex flex-col gap-6 h-[700px]">
      <div ref={containerRef} className="overflow-y-auto">
        <div
          className="h-[560px] flex flex-wrap justify-center gap-4 overflow-y-auto"
          dir="rtl"
          ref={containerRef}
        >
          <div ref={containerRef} className="overflow-y-auto">
            {showLoadingState ? (
              <div>در حال بارگذاری...</div>
            ) : usersToDisplay?.length > 0 ? (
              <div className="flex flex-wrap gap-4 p-2 h-full justify-center items-center">
                {usersToDisplay
                  .filter(
                    (item): item is ISearchedUsersData =>
                      item != null &&
                      typeof item === 'object' &&
                      'username' in item &&
                      item.username != null,
                  )
                  .map((item: ISearchedUsersData, idx: number) => (
                    <UserCard
                      key={
                        item.username
                          ? `${item.username}-${idx}`
                          : `user-${idx}`
                      }
                      cardData={item}
                    />
                  ))}
              </div>
            ) : null}
            {showLoadingMore && <div>در حال بارگذاری...</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
