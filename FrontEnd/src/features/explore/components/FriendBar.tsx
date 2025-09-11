interface FriendBarProps {
  name: string
  followers: string
  avatarUrl: string
}

const FriendBar = ({ name, followers, avatarUrl }: FriendBarProps) => (
  <div className="flex items-center justify-end w-full py-4 px-6">
    <div className="flex flex-col items-end mr-4">
      <span className="font-extrabold text-2xl text-[#222]">{name}</span>
      <span className="text-[#222] text-opacity-60 font-bold text-base mt-1">
        {followers} دنبال‌کننده
      </span>
    </div>
    <img
      src={avatarUrl}
      alt={name}
      className="w-20 h-20 rounded-full object-cover border border-[#eee]"
    />
  </div>
)

export default FriendBar
