import FriendBar from './FriendBar'
import ActionBar from './ActionBar'
import type { IExplore } from '@/types/explore'

interface FriendCardProps {
  friendData: IExplore
}

const FriendCard = ({ friendData }: FriendCardProps) => {
  return (
    <div className="w-[320px] h-[440px] bg-white rounded-3xl shadow flex flex-col">
      <img
        src={friendData.imagePath}
        alt="pin"
        className="w-full h-[305px] object-cover rounded-tr-3xl rounded-tl-3xl"
      />
      <div className="px-6 flex flex-col gap-2">
        <ActionBar
          postId={friendData.post.id}
          isLiked={friendData.liked}
          isSaved={friendData.saved}
          likesCount={friendData.likeCount}
          bookmarksCount={friendData.savedCount}
        />
        <FriendBar
          firstName={friendData.firstName}
          lastName={friendData.lastName}
          followCount={friendData.followerCount}
          avatarUrl={friendData.imagePath}
        />
      </div>
    </div>
  )
}

export default FriendCard
