// import { useState } from 'react'

const tabs: { id: 'users' | 'posts'; label: string }[] = [
  { id: 'users', label: 'افراد' },
  { id: 'posts', label: 'پست‌ها' },
]

interface TabsBarProps {
  activeTab: 'users' | 'posts'
  setActiveTab: (_: 'users' | 'posts') => void
}

export const TabsBar = ({ activeTab, setActiveTab }: TabsBarProps) => (
  <div className="flex flex-row items-center mt-8 mb-8">
    {tabs.map((tab, idx) => (
      <div key={tab.id} className="flex flex-row items-center">
        <button
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`text-xl font-bold ${
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
)

export default TabsBar
