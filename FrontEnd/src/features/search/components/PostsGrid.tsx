import { ScrollArea } from '@radix-ui/react-scroll-area'
import { PostCard } from './PostCard'
import { useTagsSearch } from '../hooks/useSearch'
import type { ISearchTagsData } from 'src/types/search'
import { useState } from 'react'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { PostDetails } from '@/features/post/components/PostDetails'

const chunkPosts = (posts: ISearchTagsData[]) => {
  const chunks: ISearchTagsData[][] = []
  let idx = 0

  // First row: 3 items
  if (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 3))
    idx += 3
  }
  // second row: 4 items
  if (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 4))
    idx += 4
  }
  // subsequent rows: 5 items
  while (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 6))
    idx += 6
  }

  return chunks
}

export const PostsGrid = () => {
  const posts = useTagsSearch(0, 50, 'ASC', '', false).data?.data || []
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      <ScrollArea className="h-screen w-full">
        <div
          className="h-[800px] flex flex-wrap justi fy-center gap-4 overflow-y-auto h-full"
          dir="rtl"
        >
          {chunkPosts(posts).map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={`flex gap-8 mb-8 ${
                rowIdx === 0
                  ? 'grid-cols-3'
                  : rowIdx === 1
                    ? 'grid-cols-4 h-[220px]'
                    : 'grid-cols-6 h-[110px]'
              }`}
              style={{
                display: 'grid',
              }}
            >
              {row.map((post, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden flex items-center justify-center"
                >
                  <PostCard
                    key={post.id}
                    image={post.images?.[0]?.url}
                    onSelectItem={() => {
                      setPostModalOpen(true)
                      setPostId(post.id)
                    }}
                  />
                </div>
              ))}
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
          ))}
        </div>
      </ScrollArea>
    </>
  )
}

export default PostsGrid
