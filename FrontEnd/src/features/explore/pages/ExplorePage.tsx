import FriendCard from '../components/FriendCard'
import { useInfiniteExplore } from '../hooks/useExplore'
import { ExploreEmpty } from '../components/EmptyTag'
import { useEffect, useRef } from 'react'
import { Loading } from '@/features/common/components/ui/loading'

export const ExplorePage = () => {
  const { allPosts, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteExplore()

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (!hasNextPage || isFetchingNextPage) return

      const { scrollTop, scrollHeight, clientHeight } = container

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
      <h2 className="font-bold text-2xl mt-2">اکسپلور</h2>
      <div ref={containerRef} className="overflow-y-auto">
        {allPosts?.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-4 p-2 h-full justify-center items-center">
              {allPosts?.map((item, idx) => (
                <FriendCard key={idx} friendData={item} />
              ))}
              {isFetchingNextPage && (
                <div className="absolute col-span-full bottom-10 flex justify-center">
                  <Loading />
                </div>
              )}
            </div>
          </>
        ) : (
          <ExploreEmpty />
        )}
      </div>
    </div>
  )
}
