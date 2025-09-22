interface PostCardProps {
  image: string
  onSelectItem: () => void
}

export function PostCard({ image, onSelectItem }: PostCardProps) {
  return (
    <div
      className="w-[315px] h-[400px] bg-white rounded-3xl shadow flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      onClick={onSelectItem}
    >
      <img src={image} className="w-full h-full object-cover" alt="" />
    </div>
  )
}
