import FriendBar from './FriendBar'
import ActionBar from './ActionBar'

interface FriendCardProps {
  name: string
  followers: string
  avatarUrl: string
  likeCount: number
  commentCount: number
  bookmarkCount: number
  pinPicture: string
}

const FriendCard = ({
  name,
  followers,
  avatarUrl,
  likeCount,
  commentCount,
  bookmarkCount,
  pinPicture,
}: FriendCardProps) => (
  <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow flex flex-col">
    <img
      src={pinPicture}
      alt="pin"
      className="w-full h-80 object-cover"
      style={{ borderTopLeftRadius: '32px', borderTopRightRadius: '32px' }}
    />
    <div className="px-6 pb-6 pt-4 flex flex-col gap-2">
      <ActionBar
        likeCount={likeCount}
        commentCount={commentCount}
        bookmarkCount={bookmarkCount}
      />
      <FriendBar name={name} followers={followers} avatarUrl={avatarUrl} />
    </div>
  </div>
)

export default FriendCard
