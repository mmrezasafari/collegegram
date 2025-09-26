import { useState, useEffect } from 'react'
import MoreTabsBar from '../components/MoreTabs'
import CloseFriendsPage from '../components/CloseFriendsPage'
import BlockListPage from '../components/BlockListPage'

interface MorePageProps {
  activeTab?: 'closefriends' | 'blocklist'
  setActiveTab?: (_: 'closefriends' | 'blocklist') => void
}

export const MorePage = ({ activeTab, setActiveTab }: MorePageProps) => {
  const [internalActiveTab, internalSetActiveTab] = useState<
    'closefriends' | 'blocklist'
  >(activeTab ?? 'closefriends')

  useEffect(() => {
    if (activeTab && activeTab !== internalActiveTab) {
      internalSetActiveTab(activeTab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleTabChange = (tab: 'closefriends' | 'blocklist') => {
    internalSetActiveTab(tab)
    setActiveTab?.(tab)
  }

  return (
    <>
      <MoreTabsBar
        activeTab={internalActiveTab}
        setActiveTab={handleTabChange}
      />
      {internalActiveTab === 'closefriends' ? (
        <CloseFriendsPage />
      ) : (
        <BlockListPage />
      )}
    </>
  )
}
