import { Separator } from '@radix-ui/react-separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { useState } from 'react'
import { OwnNotification } from '../components/OwnNotification'
import { UserNotification } from '../components/UserNotification'
import { Badge } from '@/features/common/components/ui/badge'
import { useUnreadCount } from '../hooks/notification'

export const NotificationPage = () => {
  const [defaultTab, setDefaultTab] = useState('me')
  //TODO seperate unread me and closeFriend
  const { data: unreadNotif } = useUnreadCount()

  return (
    <div className="flex flex-col gap-6 h-full">
      <h2 className="font-bold text-2xl mt-2">اعلانات</h2>
      <Tabs
        value={defaultTab}
        onValueChange={setDefaultTab}
        className="flex flex-col gap-8"
      >
        <TabsList className="flex flex-row-reverse w-full gap-8 items-center">
          <TabsTrigger
            className="cursor-pointer flex gap-4 items-center text-gray-400 font-semibold text-xl data-[state=active]:text-black"
            value="me"
          >
            <Badge
              variant="secondary"
              className="h-8 min-w-8 rounded-full text-light font-semibold text-sm p-2"
            >
              {unreadNotif?.data.unreadCount}
            </Badge>
            <span>اعلانات من</span>
          </TabsTrigger>
          <Separator
            orientation="vertical"
            className="h-10 border border-gray-400"
          />
          <TabsTrigger
            className="cursor-pointer flex gap-4 items-center text-gray-400 font-semibold text-xl data-[state=active]:text-black"
            value="myFriends"
          >
            <Badge
              variant="secondary"
              className="h-8 min-w-8 rounded-full font-semibold text-light text-sm p-2"
            >
              {unreadNotif?.data.unreadCount}
            </Badge>
            <span>اعلانات دوستان من</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent className="overflow-y-autoy" value="me">
          <OwnNotification />
        </TabsContent>
        <TabsContent className="overflow-y-autoy" value="myFriends">
          <UserNotification />
        </TabsContent>
      </Tabs>
    </div>
  )
}
