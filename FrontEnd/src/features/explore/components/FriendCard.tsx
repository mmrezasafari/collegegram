import FriendBar from './FriendBar'
import ActionBar from './ActionBar'
import type { IExplore } from '@/types/explore'
import { ImageWithFallback } from '@/features/common/components/layout/ImgWithFallBack'

interface FriendCardProps {
  friendData: IExplore
}

const FriendCard = ({ friendData }: FriendCardProps) => {
  return (
    <div className="w-[315px] h-[440px] aspect-square bg-white rounded-3xl shadow flex flex-col">
      <ImageWithFallback
        src={friendData?.post?.images[0]?.url}
        alt="explore"
        className="w-full h-[305px] object-cover group-hover:scale-105 rounded-tr-3xl rounded-tl-3xl"
      />
      <div className="px-6 flex flex-col gap-2">
        <ActionBar
          postId={friendData?.post?.id}
          isLiked={friendData?.isLiked}
          isSaved={friendData?.isSaved}
          likesCount={friendData?.likeCount}
          bookmarksCount={friendData?.savedCount}
          commentCount={friendData?.commentCount}
        />
        <FriendBar
          firstName={friendData?.firstName}
          lastName={friendData?.lastName}
          followCount={friendData?.followerCount}
          avatarUrl={friendData?.imagePath}
        />
      </div>
    </div>
  )
}

export default FriendCard
