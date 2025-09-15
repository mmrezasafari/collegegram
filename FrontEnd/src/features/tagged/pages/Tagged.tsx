import { useEffect, useState } from 'react'
import { useTagged } from '../hooks/useTagged'
import { TaggedImageCard } from '../components/TaggedImageCard'
import { TaggedEmpty } from '../components/TaggedEmpty'

const Tagged = () => {
  const { data, isLoading, error } = useTagged(10, 50, 'ASC')
  console.log(data, error)

  const taggedData = data?.data

  return taggedData && taggedData.length > 0 ? (
    <div className="flex flex-col gap-6">
      <h2 className="font-bold text-2xl"></h2>
      <main className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {isLoading ? (
          <div>در حال بارگذاری...</div>
        ) : (
          <>
            {taggedData.map((item, idx) => (
              <TaggedImageCard
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

export default Tagged
