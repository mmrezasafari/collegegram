export const SavesImageCard = ({ src, alt }: { src: string; alt?: string }) => (
  <div className="flex flex-wrap w-full overflow-y-auto overflow-x-auto items-center justify-center gap-4">
    <div className="rounded-2xl overflow-hidden bg-white w-[220px] h-[220px] flex items-center justify-center">
      <img
        src={src}
        alt={alt || 'saves'}
        className="object-cover w-full h-full"
      />
    </div>
  </div>
)
