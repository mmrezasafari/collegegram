import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import { Button } from '@/features/common/components/ui/button'
import {
  CustomeSideBarTrigger,
  SidebarProvider,
} from '@/features/common/components/ui/sidebar'
import { ProfileSidebar } from '@/features/profile/components/ProfileSideBar'
import { ProfilePage } from '@/features/profile/pages/profilePage'
import { Plus, UserRound } from 'lucide-react'

const ProfileLayout = () => {
  return (
    <div className="bg-backgroundLight h-full py-4 px-8 md:py-12 md:px-14">
      <SidebarProvider className="relative min-h-full h-auto grid grid-cols-1 md:grid-cols-[0.3fr_1fr] grid-rows-[0.01fr_1fr] md:gap-x-[72px] md:gap-y-0 gap-0 justify-center">
        <Button className="hidden md:flex col-start-1 row-start-1 col-end-2 row-end-2">
          <Plus />
          پست جدید
        </Button>
        <div className="hidden md:block col-start-2 row-start-1 col-end-3 row-end-2 justify-items-end">
          <img
            src="src/assets/images/rahnema-college-logo-far 1.png"
            width="80px"
            height="50px"
          />
        </div>
        <div className="md:hidden col-start-1 row-start-1 col-end-2 row-end-2 flex justify-between border-b border-geryLight pb-4 mb-4">
          <Avatar className="w-[48px] h-[48px] border border-geryLight">
            <AvatarImage
              className="w-full h-full object-cover object-center scale-160"
              alt="avatar"
            />
            <AvatarFallback className="bg-geryVeryLight">
              <UserRound color="#A5A5A5A5" strokeWidth={1.5} />
            </AvatarFallback>
          </Avatar>
          <CustomeSideBarTrigger />
        </div>
        <div className="md:flex-auto max-md:hidden col-start-1 row-start-2 col-end-2 row-end-3">
          <ProfileSidebar />
        </div>
        <div className="h-full col-start-1 row-start-2 col-end-2 row-end-3 md:col-start-2 md:row-start-2 md:col-end-3 md:row-end-3">
          <ProfilePage />
        </div>
      </SidebarProvider>
    </div>
  )
}

export default ProfileLayout
