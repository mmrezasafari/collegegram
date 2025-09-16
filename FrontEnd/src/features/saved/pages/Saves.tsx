import { useSaves } from '../hooks/useSaves'
import { SavesImageCard } from '../components/SavedImageCard'
import { TaggedEmpty } from '../components/SavesEmpty'

export const Saves = () => {
  const { data, isLoading } = useSaves(0, 10, 'ASC')
  const savesData = data?.data

  return (
    <div className="flex flex-col gap-6 h-full">
      <h2 className="font-bold text-2xl mt-2">ذخیره‌ها</h2>
      <div className="h-full overflow-y-auto">
        {isLoading ? (
          <div>در حال بارگذاری...</div>
        ) : savesData && savesData.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 overflow-y-auto">
            {savesData.map((item, idx) => (
              <SavesImageCard key={idx} savesPosts={item} />
            ))}
          </div>
        ) : (
          <TaggedEmpty />
        )}
      </div>
    </div>
  )
}
