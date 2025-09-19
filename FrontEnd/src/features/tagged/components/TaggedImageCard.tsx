import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { PostDetails } from '@/features/post/components/PostDetails'
import type { ITagged } from '@/types/tagged'
import { useState } from 'react'

interface IProps {
  taggedPosts: ITagged
}

export const TaggedImageCard = ({ taggedPosts }: IProps) => {
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      <div
        key={taggedPosts.id}
        className="overflow-hidden rounded-2xl w-auto h-[150px] md:h-[305px] hover:drop-shadow-xl/50 hover:scale-101 transition-all"
        onClick={() => {
          setPostModalOpen(true)
          setPostId(taggedPosts.id)
        }}
      >
        <img
          src={taggedPosts.images[0].url}
          alt="Tagged Image"
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
