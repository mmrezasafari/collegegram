import { useState } from 'react'
import MoreTabsBar from '../components/MoreTabs'
import CloseFriendsPage from '../components/closefriends'
import BlockListPage from '../components/blocklist'

interface MorePageProps {
  activeTab?: 'closefriends' | 'blocklist'
  setActiveTab?: (_: 'closefriends' | 'blocklist') => void
}

export const MorePage = ({
  activeTab = 'closefriends',
  setActiveTab,
}: MorePageProps) => {
  return (
    <>
      <MoreTabsBar
        activeTab={activeTab}
        setActiveTab={setActiveTab ?? (() => {})}
      />
      {/* Render tab content based on activeTab */}
      {activeTab === 'closefriends' && <CloseFriendsPage />}
      {activeTab === 'blocklist' && <BlockListPage />}
    </>
  )
}
