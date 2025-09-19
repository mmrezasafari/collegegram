import { useParams } from 'react-router-dom'
import { PostDetails } from '../components/PostDetails'

export const PostDetailsPage = () => {
  const param = useParams()

  return (
    <div className="flex flex-col overflow-y-auto px-1 gap-4 max-md:h-full">
      <PostDetails postId={param.postId ? param.postId : ''} mode="page" />
    </div>
  )
}
