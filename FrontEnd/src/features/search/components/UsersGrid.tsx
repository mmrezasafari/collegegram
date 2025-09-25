import { useInfiniteSearch } from '../hooks/useSearch'
import { UserCard } from './UserCard'
import { useEffect, useRef } from 'react'

export const UsersGrid = () => {
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

  return (
    <>
      <div className="flex flex-col gap-6 h-full">
        <div ref={containerRef} className="overflow-y-auto">
          {isFetchingNextPage && !allUsers?.length ? (
            <div>در حال بارگذاری...</div>
          ) : allUsers?.length > 0 ? (
            <div className="flex flex-wrap gap-4 p-2 h-full justify-center items-center">
              {allUsers.map((item: any, idx: number) => (
                <UserCard key={idx} cardData={item} />
              ))}
            </div>
          ) : (
            <div>کاربری یافت نشد.</div>
          )}
        </div>
      </div>
    </>
  )
}
