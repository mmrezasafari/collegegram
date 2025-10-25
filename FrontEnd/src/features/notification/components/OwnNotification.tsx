import { useEffect, useRef } from 'react'
import { useInfiniteMyNotifications } from '../hooks/notification'
import { NotificationItem } from './NotificationItem'
import { Loading } from '@/features/common/components/ui/loading'

export const OwnNotification = () => {
  const {
    allMyNotifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteMyNotifications()
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
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        className="overflow-y-auto h-[calc(100vh-250px)] px-2"
      >
        {isPending ? (
          <Loading className="flex justify-center" />
        ) : allMyNotifications?.length > 0 ? (
          <>
            <div className="flex flex-col gap-2 p-2 h-full items-end">
              {allMyNotifications?.map((item, idx) => (
                <NotificationItem key={idx} notification={item} />
              ))}
              {isFetchingNextPage && (
                <div className="col-span-full flex justify-center">
                  <Loading />
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="w-full text-center text-base font-medium">
            اطلاعاتی وجود ندارد
          </p>
        )}
      </div>
    </div>
  )
}
