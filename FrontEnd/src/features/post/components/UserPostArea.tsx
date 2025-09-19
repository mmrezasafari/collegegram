import { useState } from 'react'
import { useGetPosts } from '../hooks/usePosts'
import { PostDetails } from './PostDetails'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'

export const UserPostArea = () => {
  const { data } = useGetPosts()
  const images = data?.data
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      {images?.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 overflow-y-auto">
          {images?.map((data, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl w-auto h-[150px] md:h-[305px]"
              onClick={() => {
                setPostModalOpen(true)
                setPostId(data.id)
              }}
            >
              <img
                src={data.images.length ? data.images[0].url : ''}
                alt="Image 1"
                className="w-full h-full object-cover"
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
        <DialogAndDrawerWizard
          open={postModalOpen}
          setOpen={setPostModalOpen}
          className="h-[95%] md:max-w-full md:w-[1250px] md:h-[730px] flex flex-col md:px-12"
        >
          <PostDetails postId={postId} />
        </DialogAndDrawerWizard>
      )}
    </>
  )
}
