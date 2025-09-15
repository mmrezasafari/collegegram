export const TaggedImageCard = ({
  src,
  alt,
}: {
  src: string
  alt?: string
}) => (
  <div className="rounded-2xl overflow-hidden bg-[#222] w-[220px] h-[220px] flex items-center justify-center">
    <img
      src={src}
      alt={alt || 'tagged'}
      className="object-cover w-full h-full"
    />
  </div>
)
