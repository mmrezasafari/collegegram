interface PostCardProps {
  image: string
  onSelectItem: () => void
}

export function PostCard({ image, onSelectItem }: PostCardProps) {
  return (
    <div
      className="w-full h-full bg-white rounded-3xl shadow items-center justify-center cursor-pointer overflow-hidden"
      onClick={onSelectItem}
    >
      <img
        src={image}
        className="w-full h-full object-cover disp aspect-1/1"
        alt=""
      />
    </div>
  )
}
