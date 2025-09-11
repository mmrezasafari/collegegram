import { Bookmark, Heart, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface Props {
  likeCount: number
  commentCount: number
  bookmarkCount: number
}

const ActionBar = ({ likeCount, commentCount, bookmarkCount }: Props) => {
  const [likes, setLikes] = useState(likeCount)
  const [comments, setComments] = useState(commentCount)
  const [bookmarks, setBookmarks] = useState(bookmarkCount)

  return (
    <div className="flex justify-center items-center gap-10 mt-4">
      {/* Bookmark */}
      <button
        className="flex flex-col items-center group"
        onClick={() => setBookmarks(bookmarks + 1)}
        aria-label="Bookmark"
      >
        <Bookmark size={30} color="#222" className="group-active:scale-90" />
        <span className="mt-1 text-lg font-bold text-[#222]">{bookmarks}</span>
      </button>
      {/* Heart */}
      <button
        className="flex flex-col items-center group"
        onClick={() => setLikes(likes + 1)}
        aria-label="Like"
      >
        <Heart size={30} color="#222" className="group-active:scale-90" />
        <span className="mt-1 text-lg font-bold text-[#222]">{likes}</span>
      </button>
      {/* Comment */}
      <button
        className="flex flex-col items-center group"
        onClick={() => setComments(comments + 1)}
        aria-label="Comment"
      >
        <MessageCircle
          size={30}
          color="#222"
          className="group-active:scale-90"
        />
        <span className="mt-1 text-lg font-bold text-[#222]">{comments}</span>
      </button>
    </div>
  )
}

export default ActionBar
