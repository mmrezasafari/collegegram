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

const chunkPosts = (posts: ISearchTagsData[]) => {
  const chunks: ISearchTagsData[][] = []
  let idx = 0

  // First row: 1 item (mobile) / 3 items (desktop)
  if (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 3))
    idx += 3
  }
  // Second row: 2 items (mobile) / 4 items (desktop)
  if (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 4))
    idx += 4
  }
  // Subsequent rows: 3 items (mobile) / 6 items (desktop)
  while (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 6))
    idx += 6
  }

  return chunks
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

  return (
    <div className="flex flex-col gap-6 h-[700px]">
      <div ref={containerRef} className="overflow-y-auto">
        <div
          className="h-[560px] flex flex-wrap justify-center gap-4 overflow-y-auto"
          dir="rtl"
          ref={containerRef}
        >
          {showLoadingState ? (
            <div className="flex items-center justify-center h-full">
              در حال بارگذاری...
            </div>
          ) : tagsToDisplay && tagsToDisplay.length > 0 ? (
            chunkPosts(
              tagsToDisplay.filter(
                (item): item is ISearchTagsData =>
                  item != null &&
                  typeof item === 'object' &&
                  'id' in item &&
                  item.id != null &&
                  'images' in item &&
                  Array.isArray(item.images) &&
                  item.images.length > 0,
              ),
            ).map((row, rowIdx) => (
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
                    key={`${post.id}-${idx}`}
                    className="rounded-2xl overflow-hidden flex items-center justify-center"
                  >
                    <div className="overflow-hidden rounded-2xl w-full h-[150px] md:h-[305px] hover:drop-shadow-xl/50 hover:scale-101 transition-all">
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
            ))
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
