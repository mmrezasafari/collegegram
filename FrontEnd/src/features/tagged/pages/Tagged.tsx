import { useTagged } from '../hooks/useTagged'
import { TaggedImageCard } from '../components/TaggedImageCard'
import { TaggedEmpty } from '../components/TaggedEmpty'

export const Tagged = () => {
  const { data, isLoading } = useTagged(0, 10, 'ASC')
  const taggedData = data?.data

  return (
    <div className="flex flex-col gap-6 h-full">
      <h2 className="font-bold text-2xl mt-2">تگ‌‌شده‌ها</h2>
      <div className="h-full overflow-y-auto">
        {isLoading ? (
          <div>در حال بارگذاری...</div>
        ) : taggedData && taggedData?.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full p-2 overflow-y-auto">
            {taggedData?.map((data, idx) => (
              <TaggedImageCard key={idx} taggedPosts={data} />
            ))}
          </div>
        ) : (
          <TaggedEmpty />
        )}
      </div>
    </div>
  )
}
