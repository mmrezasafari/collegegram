// import { useEffect, useState } from 'react'
import { useSaves } from '../hooks/useSaves'
import { SavesImageCard } from '../components/SavedImageCard'
import { TaggedEmpty } from '../components/SavesEmpty'

const Saves = () => {
  const { data, isLoading, error } = useSaves(0, 10, 'ASC')
  console.log(data, error)

  const SavesData = data?.data

  return SavesData && SavesData.length > 0 ? (
    <div className="flex flex-col gap-6">
      <h2 className="font-bold text-2xl"></h2>
      <main className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {isLoading ? (
          <div>در حال بارگذاری...</div>
        ) : (
          <>
            {SavesData.map((item, idx) => (
              <SavesImageCard
                key={idx}
                src={item.images[0].url}
                alt={item.caption || `tagged-${idx}`}
              />
            ))}
          </>
        )}
      </main>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen w-full">
      <TaggedEmpty />
    </div>
  )
}

export default Saves
