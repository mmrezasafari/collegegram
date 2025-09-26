import { useState } from 'react'
import MoreTabsBar from '../components/MoreTabs'
import CloseFriendsPage from '../components/closefriends'
import BlockListPage from '../components/blocklist'

export const MorePage = () => {
  const [activeTab, setActiveTab] = useState<'closefriends' | 'blocklist'>(
    'closefriends',
  )

  return (
    <>
      <MoreTabsBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Render tab content based on activeTab */}
      {activeTab === 'closefriends' && <CloseFriendsPage />}
      {activeTab === 'blocklist' && <BlockListPage />}
    </>
  )
}
