import { useEffect, useState } from 'react'
import SuccessBanner from './components/SuccessBanner'
import FriendCard from './components/FriendCard'

// Dummy followers data
const dummyFollowers = [
  {
    name: 'متین دهقان',
    followers: '۱۷۰ هزار',
    avatarUrl: '/avatars/matin.jpg',
    pinPicture: '/pins/lavender.jpg',
    likeCount: 138,
    commentCount: 138,
    bookmarkCount: 15,
  },
  // Add more dummy followers as needed
  {
    name: 'متین دهقان',
    followers: '۱۷۰ هزار',
    avatarUrl: '/avatars/matin.jpg',
    pinPicture: '/pins/lavender.jpg',
    likeCount: 138,
    commentCount: 138,
    bookmarkCount: 15,
  },
  {
    name: 'متین دهقان',
    followers: '۱۷۰ هزار',
    avatarUrl: '/avatars/matin.jpg',
    pinPicture: '/pins/lavender.jpg',
    likeCount: 138,
    commentCount: 138,
    bookmarkCount: 15,
  },
  {
    name: 'متین دهقان',
    followers: '۱۷۰ هزار',
    avatarUrl: '/avatars/matin.jpg',
    pinPicture: '/pins/lavender.jpg',
    likeCount: 138,
    commentCount: 138,
    bookmarkCount: 15,
  },
  {
    name: 'متین دهقان',
    followers: '۱۷۰ هزار',
    avatarUrl: '/avatars/matin.jpg',
    pinPicture: '/pins/lavender.jpg',
    likeCount: 138,
    commentCount: 138,
    bookmarkCount: 15,
  },
  {
    name: 'متین دهقان',
    followers: '۱۷۰ هزار',
    avatarUrl: '/avatars/matin.jpg',
    pinPicture: '/pins/lavender.jpg',
    likeCount: 138,
    commentCount: 138,
    bookmarkCount: 15,
  },
]

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
  const [followers, setFollowers] = useState<typeof dummyFollowers>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false)
      // Simulate having followers after banner disappears
      setFollowers(dummyFollowers)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center justify-center">
        {showBanner ? (
          <SuccessBanner />
        ) : followers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            {followers.map((follower, idx) => (
              <FriendCard key={idx} {...follower} />
            ))}
          </div>
        ) : (
          <ExploreEmpty />
        )}
      </main>
    </div>
  )
}

export default Explore
