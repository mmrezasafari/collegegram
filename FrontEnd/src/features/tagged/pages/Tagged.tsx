import { useTagged } from '../hooks/useTagged'
import { TaggedImageCard } from '../components/TaggedImageCard'
import { TaggedEmpty } from '../components/TaggedEmpty'

const Tagged = () => {
  const { data, isLoading } = useTagged(0, 10, 'ASC')
  const taggedData = data?.data

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-bold text-2xl">تگ‌‌شده‌ها</h2>
      <main className="w-full">
        {isLoading ? (
          <div>در حال بارگذاری...</div>
        ) : (
          <>
            {taggedData?.length ? (
              <div className="h-[650px] md:h-[750px] grid grid-cols-2 lg:grid-cols-3 gap-4 px-2 overflow-y-auto">
                {taggedData?.map((data, i) => (
                  <TaggedImageCard key={i} taggedPosts={data} />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-geryLight rounded-3xl">
                <div className="flex flex-col text-center gap-4">
                  <div className="font-semibold text-sm md:text-base">
                    <div className="flex items-center justify-center min-h-screen w-full">
                      <TaggedEmpty />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Tagged
