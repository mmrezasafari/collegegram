import { useState } from 'react'
import { useGetPosts } from '../hooks/usePosts'
import { PostDetailsModal } from './PostDetailsModal'
import { Button } from '@/features/common/components/ui/button'
import { Plus } from 'lucide-react'
import { DialogAndModalWizard } from '@/features/common/components/layout/DialogAndModalWizard'
import { UploadPostForm } from './UploadPostForm'

export const PostArea = () => {
  const { data } = useGetPosts()
  const images = data?.data
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [uploadPostWizardOpen, setUploadPostWizardOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      {
        images?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 h-auto overflow-y-auto">
            {images?.map((data, i) => (
              <div key={i} className="overflow-hidden rounded-2xl" onClick={() => {
                setPostModalOpen(true)
                setPostId(data.id)
              }
              }>
                <img
                  src={`http://localhost:3000/BackEnd/${data.images[0].url}`}
                  alt="Image 1"
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          // TODO: seperate post areas me from user
          <div className="h-full flex items-center justify-center border border-geryLight rounded-3xl">
            <div className="flex flex-col text-center gap-4">
              <div className="font-semibold text-sm md:text-base">
                هنوز هیچ پستی توی صفحت نذاشتی!
                <br />
                بجنب تا دیر نشده
              </div>
              {/* upload post button tirgger */}
              <Button className="w-full max-md:hidden" onClick={() => setUploadPostWizardOpen(true)}>
                <Plus />
                پست جدید
              </Button>
              <Button className='md:hidden' onClick={() => setUploadPostWizardOpen(true)}>
                <Plus />
                پست جدید
              </Button>
            </div>
          </div>
        )
      }
      {
        uploadPostWizardOpen &&
        <DialogAndModalWizard open={uploadPostWizardOpen} setOpen={setUploadPostWizardOpen}>
          <UploadPostForm onSuccess={() => setUploadPostWizardOpen(false)} />
        </DialogAndModalWizard>
      }
      {
        postModalOpen && <PostDetailsModal open={postModalOpen} setOpen={setPostModalOpen} postId={postId} />
      }
    </>
  )
}
