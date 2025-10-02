import { PostCard } from './PostCard'
import { useInfiniteTagSearch } from '../hooks/useSearch'
import type { ISearchTagsData } from 'src/types/search'
import { useEffect, useRef, useState } from 'react'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { PostDetails } from '@/features/post/components/PostDetails'

interface PostsGridProps {
  searchResults?: ISearchTagsData[]
  searchQuery?: string
}

export const PostsGrid = ({ searchResults }: PostsGridProps) => {
  const { allTags, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTagSearch()

  // Use search results if provided, otherwise use infinite scroll data
  const tagsToDisplay =
    searchResults && searchResults.length > 0 ? searchResults : []
  const showLoadingState =
    !searchResults && isFetchingNextPage && !allTags?.length
  const showLoadingMore = !searchResults && isFetchingNextPage

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

  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  // Helper function to organize posts into rows with different sizes
  const organizePostsIntoRows = (posts: ISearchTagsData[]) => {
    const rows: ISearchTagsData[][] = []
    let currentIndex = 0

    while (currentIndex < posts.length) {
      const rowIndex = rows.length
      let itemsInThisRow: number

      // Define items per row based on row index
      if (rowIndex === 0) {
        itemsInThisRow = 3 // First row: 1 item on mobile, 3 on desktop
      } else if (rowIndex === 1) {
        itemsInThisRow = 4 // Second row: 2 items on mobile, 4 on desktop
      } else {
        itemsInThisRow = 6 // Subsequent rows: 3 items on mobile, 6 on desktop
      }

      const row = posts.slice(currentIndex, currentIndex + itemsInThisRow)
      if (row.length > 0) {
        rows.push(row)
        currentIndex += itemsInThisRow
      } else {
        break
      }
    }

    return rows
  }

  const filteredPosts = tagsToDisplay.filter(
    (item): item is ISearchTagsData =>
      item != null && Array.isArray(item.images) && item.images.length > 0,
  )

  const postRows = organizePostsIntoRows(filteredPosts)

  return (
    <div className="flex flex-col gap-6 h-[700px]">
      <div ref={containerRef} className="overflow-y-auto">
        <div className="h-[560px] overflow-y-auto" dir="rtl" ref={containerRef}>
          {showLoadingState ? (
            <div className="flex items-center justify-center h-full">
              در حال بارگذاری...
            </div>
          ) : postRows.length > 0 ? (
            <div className="flex flex-col gap-2 p-2">
              {postRows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`flex gap-2 mb-2 ${
                    rowIdx === 0
                      ? 'grid-cols-1 md:grid-cols-3'
                      : rowIdx === 1
                        ? 'grid-cols-2 md:grid-cols-4'
                        : 'grid-cols-3 md:grid-cols-6'
                  }`}
                  style={{
                    display: 'grid',
                  }}
                >
                  {row.map((post, idx) => (
                    <div
                      key={`${post.id}-${rowIdx}-${idx}`}
                      className="rounded-2xl overflow-hidden flex items-center justify-center"
                    >
                      <div className="overflow-hidden rounded-2xl w-full h-[150px] md:h-[250px] lg:h-[250px] hover:drop-shadow-xl/50 hover:scale-101 transition-all">
                        <PostCard
                          image={post?.images[0]?.url ?? ''}
                          onSelectItem={() => {
                            setPostModalOpen(true)
                            setPostId(post.id)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full"></div>
          )}
          {showLoadingMore && (
            <div className="flex items-center justify-center">
              در حال بارگذاری...
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
      </div>
    </div>
  )
}

export default PostsGrid
