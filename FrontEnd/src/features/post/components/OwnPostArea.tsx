import { useState } from 'react'
import { useGetPosts } from '../hooks/usePosts'
import { PostDetails } from './PostDetails'
import { Button } from '@/features/common/components/ui/button'
import { Plus } from 'lucide-react'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { UploadPostForm } from './UploadPostForm'

export const OwnPostArea = () => {
  const { data } = useGetPosts()
  const images = data?.data
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [uploadPostWizardOpen, setUploadPostWizardOpen] = useState(false)
  const [postId, setPostId] = useState('')

  console.log(images)

  return (
    <>
      {images?.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 overflow-y-auto h-full">
          {images?.map((data, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl w-auto h-[150px] md:h-[305px] hover:drop-shadow-xl/50 hover:scale-101 transition-all"
              onClick={() => {
                setPostModalOpen(true)
                setPostId(data.id)
              }}
            >
              <img
                src={data.images.length ? data.images[0].url : ''}
                alt="Image 1"
                className="w-full h-full object-cover hover:justify-items-center-safe cursor-pointer"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center border border-geryLight rounded-3xl">
          <div className="flex flex-col text-center gap-4">
            <div className="font-semibold text-sm md:text-base">
              هنوز هیچ پستی توی صفحت نذاشتی!
              <br />
              بجنب تا دیر نشده
            </div>
            {/* upload post button tirgger */}
            <Button
              className="w-full max-md:hidden"
              onClick={() => setUploadPostWizardOpen(true)}
            >
              <Plus />
              پست جدید
            </Button>
            <Button
              className="md:hidden"
              onClick={() => setUploadPostWizardOpen(true)}
            >
              <Plus />
              پست جدید
            </Button>
          </div>
        </div>
      )}
      {uploadPostWizardOpen && (
        <DialogAndDrawerWizard
          open={uploadPostWizardOpen}
          setOpen={setUploadPostWizardOpen}
        >
          <UploadPostForm onSuccess={() => setUploadPostWizardOpen(false)} />
        </DialogAndDrawerWizard>
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
