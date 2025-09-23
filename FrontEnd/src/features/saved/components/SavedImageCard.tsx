import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { PostDetails } from '@/features/post/components/PostDetails'
import type { ISaved } from '@/types/seved'
import { useState } from 'react'

interface IProps {
  savesPosts: ISaved
}

export const SavesImageCard = ({ savesPosts }: IProps) => {
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      <div
        key={savesPosts?.id}
        className="overflow-hidden rounded-2xl w-full h-[150px] md:h-[305px] hover:drop-shadow-xl/50 hover:scale-101 transition-all"
        onClick={() => {
          setPostModalOpen(true)
          setPostId(savesPosts?.id)
        }}
      >
        <img
          src={savesPosts?.images?.[savesPosts.images.length - 1]?.url}
          alt="saved Image"
          className="w-full h-full object-cover hover:justify-items-center-safe cursor-pointer"
        />
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
    </>
  )
}
