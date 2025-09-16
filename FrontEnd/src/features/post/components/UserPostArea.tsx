import { useState } from 'react'
import { useGetPosts } from '../hooks/usePosts'
import { PostDetailsModal } from './PostDetailsModal'
import { DialogAndModalWizard } from '@/features/common/components/layout/DialogAndModalWizard'
import { baseUrl } from '@/utils/baseUrl'

export const UserPostArea = () => {
  const { data } = useGetPosts()
  const images = data?.data
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      {images?.length ? (
        <div className="h-[460px] md:h-[550px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 overflow-y-auto">
          {images?.map((data, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl h-66"
              onClick={() => {
                setPostModalOpen(true)
                setPostId(data.id)
              }}
            >
              <img
                src={baseUrl(data.images[0].url)}
                alt="Image 1"
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center border border-geryLight rounded-3xl">
          <div className="flex flex-col text-center gap-4">
            <div className="font-semibold text-sm md:text-base">
              این کاربر هنوز هیچ پستی بارگذاری نکرده
            </div>
          </div>
        </div>
      )}
      {postModalOpen && (
        <DialogAndModalWizard
          open={postModalOpen}
          setOpen={setPostModalOpen}
          className="h-[95%] md:max-w-full md:w-[1250px] md:h-[730px] flex flex-col md:px-12"
        >
          <PostDetailsModal postId={postId} />
        </DialogAndModalWizard>
      )}
    </>
  )
}
