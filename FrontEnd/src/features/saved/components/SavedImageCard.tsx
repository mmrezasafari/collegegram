import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { PostDetails } from '@/features/post/components/PostDetails'
import type { ISaved } from '@/types/seved'
import { baseUrl } from '@/utils/baseUrl'
import { useState } from 'react'

interface IProps {
  savesPosts: ISaved
}

export const SavesImageCard = ({ savesPosts }: IProps) => {
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      {savesPosts.images.map((savedPost) => (
        <div
          key={savedPost.id}
          className="overflow-hidden rounded-2xl w-auto h-[150px] md:h-[305px]"
          onClick={() => {
            setPostModalOpen(true)
            setPostId(savesPosts.id)
          }}
        >
          <img
            src={baseUrl(savedPost.url)}
            alt="saved Image"
            className="h-full w-full object-cover"
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
    </>
  )
}
