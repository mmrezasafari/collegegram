import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/common/components/ui/tabs'
import { BlockedListPage } from '../components/BlockedListTab'
import { CloseFriendsPage } from '../components/CloseFriendsTab'
import { Separator } from '@radix-ui/react-separator'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const FriendsAndBlockedPage = () => {
  const [defaultTab, setDefaultTab] = useState('close-friends')
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get('tab')
    if (
      tabParam &&
      (tabParam === 'close-friends' || tabParam === 'block-list')
    ) {
      setDefaultTab(tabParam)
    }
  }, [location.search])

  return (
    <div className="w-full h-full md:w-[500px] md:h-auto md:max-h-[700px] flex flex-col justify-center items-start bg-backgroundLight md:rounded-3xl py-16 max-md:px-6 gap-8">
      <Tabs
        value={defaultTab}
        onValueChange={setDefaultTab}
        className="h-[510px] d-flex items-center bg-muted rounded-lg gap-12"
      >
        <TabsList className="d-flex justify-baseline w-full">
          <TabsTrigger
            className="text-[20px] rounded-none data-[state=active]:shadow-none text-grey data-[state=active]:text-black cursor-pointer"
            value="close-friends"
          >
            دوستان نزدیک
          </TabsTrigger>
          <Separator orientation="vertical" className="bg-black" />
          <TabsTrigger
            className="text-[20px] rounded-none data-[state=active]:shadow-none text-grey data-[state=active]:text-black cursor-pointer"
            value="block-list"
          >
            لیست سیاه
          </TabsTrigger>
        </TabsList>
        <TabsContent value="close-friends">
          <CloseFriendsPage />
        </TabsContent>
        <TabsContent value="block-list">
          <BlockedListPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
