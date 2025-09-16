import { useToggleSavePost } from '@/features/bookmark/hooks/useBookmark'
import { useToggleLike } from '@/features/like/hooks/useLike'
import { Bookmark, Heart, MessageCircle } from 'lucide-react'

interface IProps {
  postId: string
  isLiked: boolean
  isSaved: boolean
  likesCount: number
  bookmarksCount: number
}

const ActionBar = ({
  postId,
  isLiked,
  isSaved,
  likesCount,
  bookmarksCount,
}: IProps) => {
  const { mutate: toggleSaveAction, isPending: savePending } =
    useToggleSavePost(postId)
  const { mutate: toogleLikeAction, isPending: likePending } =
    useToggleLike(postId)

  const onToggleSave = () => {
    if (isSaved) {
      toggleSaveAction('unsave')
    } else {
      toggleSaveAction('save')
    }
  }

  const onToggleLike = () => {
    if (isLiked) {
      toogleLikeAction('unlike')
    } else {
      toogleLikeAction('like')
    }
  }

  return (
    <div className="flex w-full items-center gap-4 py-4">
      {/* Comment */}
      <button
        className="flex p-0 gap-2 justify-center items-center text-primary cursor-pointer"
        disabled={true}
      >
        <MessageCircle color="#222" className="group-active:scale-90" />
        <span className="text-[#222]">7</span>
      </button>
      {/* Heart */}
      <button
        className="flex gap-2 justify-center items-center text-primary cursor-pointer"
        onClick={onToggleLike}
        disabled={likePending}
      >
        <Heart
          color="#222"
          className="group-active:scale-90"
          fill={isLiked ? '#ea5a69' : 'white'}
        />
        <span className="text-[#222]">{likesCount}</span>
      </button>
      {/* Bookmark */}
      <button
        className="flex gap-2 justify-center items-center text-primary cursor-pointer"
        onClick={onToggleSave}
        disabled={savePending}
      >
        <Bookmark
          color="#222"
          className="group-active:scale-90"
          fill={isSaved ? '#ea5a69' : 'white'}
        />
        <span className="text-[#222]">{bookmarksCount}</span>
      </button>
    </div>
  )
}

export default ActionBar
