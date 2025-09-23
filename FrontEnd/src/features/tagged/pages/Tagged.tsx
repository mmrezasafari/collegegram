import { useInfiniteTagged } from '../hooks/useTagged'
import { TaggedImageCard } from '../components/TaggedImageCard'
import { TaggedEmpty } from '../components/TaggedEmpty'
import { useEffect, useRef } from 'react'

export const Tagged = () => {
  const { allPosts, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTagged()

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
      <h2 className="font-bold text-2xl mt-2">تگ‌‌شده‌ها</h2>
      <div ref={containerRef} className="overflow-y-auto">
        {isFetchingNextPage && !allPosts?.length ? (
          <div>در حال بارگذاری...</div>
        ) : allPosts?.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 h-full justify-items-center items-center">
              {allPosts?.map((item) => (
                <TaggedImageCard key={item.id} taggedPosts={item} />
              ))}
            </div>
          </>
        ) : (
          <TaggedEmpty />
        )}
        {isFetchingNextPage && <div>در حال بارگذاری...</div>}
      </div>
    </div>
  )
}
