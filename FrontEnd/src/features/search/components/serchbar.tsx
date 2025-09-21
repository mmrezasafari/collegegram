import { useState } from 'react'
import { useSearch } from '../hooks/useSearch'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { userSuggestions, tagSuggestions, loading } = useSearch(query)

  const filteredSearchSuggestions =
    query.trim().length > 0
      ? [
          'طبیعت',
          'طبیعت ایران',
          'طبیعت زیبا',
          'طبیعت شمال',
          'طبیعت جنوب',
        ].filter((s) => s.includes(query.trim()))
      : []

  return (
    <div className="w-full flex flex-col items-center relative">
      <div className="flex items-center bg-white rounded-full px-6 py-3 w-[400px] md:w-[600px] shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="جستجو در افراد، تگ‌ها، واژه‌ها و ..."
          className="bg-transparent border-none outline-none text-gray-500 text-xl pr-6 w-full text-right"
          dir="rtl"
        />
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
      </div>
      {showSuggestions &&
        (userSuggestions.length > 0 || tagSuggestions.length > 0) && (
          <div className="absolute top-full mt-2 w-[400px] md:w-[600px] bg-white rounded-2xl shadow-lg z-10">
            {/* User Suggestions */}
            {userSuggestions.length > 0 && (
              <div className="px-6 pt-4 pb-2 relative">
                {userSuggestions.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between mb-3"
                    onMouseDown={() => setQuery(user.name)}
                  >
                    <span className="text-right">{user.name}</span>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ml-2"
                    />
                  </div>
                ))}
                <button
                  className="bg-[#F46B82] text-white rounded-full px-6 py-2 font-bold text-lg mt-2 absolute left-6"
                  style={{ bottom: 0 }}
                >
                  بیشتر
                </button>
              </div>
            )}
            {/* Tag Suggestions */}
            {tagSuggestions.length > 0 && (
              <div className="px-6 pb-4">
                {tagSuggestions.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => setQuery(tag.name)}
                  >
                    <span className="text-right w-full">{tag.name}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
            {/* Divider */}
            {userSuggestions.length > 0 && tagSuggestions.length > 0 && (
              <hr className="my-2" />
            )}
            {/* Search Suggestions */}
            {filteredSearchSuggestions.length > 0 && (
              <div className="px-6 pb-4">
                {filteredSearchSuggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => setQuery(s)}
                  >
                    <span className="text-right w-full">{s}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  )
}
