import FriendCard from '../components/FriendCard'
import { useInfiniteExplore } from '../hooks/useExplore'
import { ExploreEmpty } from '../components/EmptyTag'
import { useEffect, useRef } from 'react'

const Explore = () => {
  const { allPosts, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteExplore()

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
    <div className="flex flex-col gap-6 h-full">
      <h2 className="font-bold text-2xl">اکسپلور</h2>
      <div ref={containerRef} className="overflow-y-auto">
        {isFetchingNextPage && !allPosts?.length ? (
          <div>در حال بارگذاری...</div>
        ) : allPosts?.length > 0 ? (
          <div className="flex flex-wrap gap-4 p-2 h-full justify-center items-center">
            {allPosts?.map((item, idx) => (
              <FriendCard key={idx} friendData={item} />
            ))}
          </div>
        ) : (
          <ExploreEmpty />
        )}
        {isFetchingNextPage && <div>در حال بارگذاری...</div>}
      </div>
    </div>
  )
}

export default Explore
