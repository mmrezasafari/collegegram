import { useState } from 'react'
import { SearchBar } from '../components/searchbar'

const tabs = [
  { id: 'users', label: 'افراد' },
  { id: 'posts', label: 'پست‌ها' },
]

// Dummy user data for demonstration
const users = Array.from({ length: 8 }).map((_, idx) => ({
  id: idx,
  name: 'متین دهقان',
  followers: '۱۲۰ هزار دنبال‌کننده',
  avatar: '/avatar.png',
}))

// Dummy post images for demonstration
const posts = [
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg',
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg',
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg',
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg',
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg',
]

// Utility to chunk posts array
const chunkPosts = (posts: string[]) => {
  const chunks: string[][] = []
  let idx = 0

  // First row: 3 items
  if (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 3))
    idx += 3
  }
  // Second row: 4 items
  if (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 4))
    idx += 4
  }
  // Subsequent rows: 6 items each
  while (posts.length > idx) {
    chunks.push(posts.slice(idx, idx + 6))
    idx += 6
  }
  return chunks
}

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="bg-[#f7f7f7] min-h-screen w-full flex flex-col items-right pt-8">
      {/* Search Bar */}
      <SearchBar />
      {/* <div className="w-full flex justify-center">
        <div className="flex items-center bg-white rounded-full px-6 py-3 w-[400px] md:w-[600px] shadow-sm">
          <svg
            className="w-7 h-7 text-gray-500 ml-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="جستجو در افراد، تگ‌ها، واژه‌ها و ..."
            className="bg-transparent border-none outline-none text-gray-500 text-xl pr-6 w-full text-right"
            dir="rtl"
          />
        </div>
      </div> */}

      {/* Tabs */}
      <div className="flex flex-row items-center mt-8 mb-8">
        {tabs.map((tab, idx) => (
          <div key={tab.id} className="flex flex-row items-center">
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`text-2xl font-bold ${
                activeTab === tab.id ? 'text-black' : 'text-gray-400'
              }`}
              style={{ direction: 'rtl' }}
            >
              {tab.label}
            </button>
            {idx !== tabs.length - 1 && (
              <div className="h-7 w-px bg-gray-300 mx-6" />
            )}
          </div>
        ))}
      </div>

      {/* Users Grid */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 md:px-0 max-w-6xl">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl flex flex-col justify-between p-6 h-[180px] w-full"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex flex-col items-start">
                  <span className="font-bold text-lg text-right">
                    {user.name}
                  </span>
                  <span className="text-gray-500 text-sm text-right">
                    {user.followers}
                  </span>
                </div>
              </div>
              <button className="bg-[#F46B82] text-white rounded-full py-2 mt-6 font-bold text-lg">
                دنبال کردن +
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        <div
          className="w-full px-4 md:px-0 max-w-6xl"
          style={{
            maxHeight: '600px',
            overflowY: 'auto',
            direction: 'rtl',
          }}
        >
          {chunkPosts(posts).map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={`flex gap-8 mb-8 ${
                rowIdx === 0
                  ? 'grid-cols-3'
                  : rowIdx === 1
                    ? 'grid-cols-4'
                    : 'grid-cols-6'
              }`}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${row.length}, 1fr)`,
              }}
            >
              {row.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden bg-white w-full h-[220px] flex items-center justify-center"
                  style={{
                    border:
                      rowIdx === 0 && idx === 1 ? '3px solid #4A90E2' : 'none', // Example: highlight one image
                  }}
                >
                  <img
                    src={img}
                    alt={`post-${rowIdx}-${idx}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
