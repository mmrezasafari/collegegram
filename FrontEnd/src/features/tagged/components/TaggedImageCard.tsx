import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { PostDetailsModal } from '@/features/post/components/PostDetailsModal'
import type { ITagged } from '@/types/tagged'
import { baseUrl } from '@/utils/baseUrl'
import { useState } from 'react'

interface IProps {
  taggedPosts: ITagged
}

export const TaggedImageCard = ({ taggedPosts }: IProps) => {
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      {taggedPosts.images.map((taggedPost) => (
        <div
          key={taggedPost.id}
          className="overflow-hidden rounded-2xl w-auto h-[150px] md:h-[305px]"
          onClick={() => {
            setPostModalOpen(true)
            setPostId(taggedPosts.id)
          }}
        >
          <img
            src={baseUrl(taggedPost.url)}
            alt="Tagged Image"
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
          <PostDetailsModal postId={postId} />
        </DialogAndDrawerWizard>
      )}
    </>
  )
}
