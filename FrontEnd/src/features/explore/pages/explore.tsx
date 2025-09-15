import { useEffect, useState } from 'react'
import SuccessBanner from '../components/SuccessBanner'
import FriendCard from '../components/FriendCard'
import { useExplore } from '../hooks/useExplore'

const ExploreEmpty = () => (
  <div className="flex flex-col items-center w-full max-w-2xl mx-auto mt-8">
    <h1 className="font-bold text-xl md:text-3xl mb-6 text-[#200] text-center">
      سلام به کالج‌گرام خوش اومدی!
    </h1>
    <div className="font-bold text-xs md:text-xl text-[#400] mb-10 text-center leading-relaxed">
      برای دیدن پست‌ها در این صفحه، باید کالج‌گرامی‌ها رو دنبال کنی.
      <br />
      آماده‌ای؟
    </div>
    <button
      className="bg-[#F37B8C] text-white border-none rounded-full px-12 py-2 text-s font-bold cursor-pointer"
      onClick={() => alert('جستجوی کالج‌گرامی‌ها')}
    >
      جستجوی کالج‌گرامی‌ها
    </button>
  </div>
)

const Explore = () => {
  const [showBanner, setShowBanner] = useState(true)
  const { data, isLoading } = useExplore(0, 10, 'ASC')
  const exploreData = data?.data

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-bold text-2xl">اکسپلور</h2>
      <main className="w-full h-[750px] overflow-y-auto flex flex-wrap items-center justify-center gap-4 px-2">
        {showBanner ? (
          <SuccessBanner />
        ) : isLoading ? (
          <div>در حال بارگذاری...</div>
        ) : exploreData && exploreData.length > 0 ? (
          <>
            {exploreData.map((follower, idx) => (
              <FriendCard key={idx} friendData={follower} />
            ))}
          </>
        ) : (
          <ExploreEmpty />
        )}
      </main>
    </div>
  )
}

export default Explore
