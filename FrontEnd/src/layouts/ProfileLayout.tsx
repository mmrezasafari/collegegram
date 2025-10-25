import logo from '@/assets/images/rahnema-college-logo.png'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import {
  CustomeSideBarTrigger,
  SidebarProvider,
} from '@/features/common/components/ui/sidebar'
import { AppSidebar } from '@/features/common/components/layout/AppSideBar'
import { Plus, UserRound } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/features/common/components/ui/button'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { UploadPostForm } from '@/features/post/components/UploadPostForm'
import { FixedMenu } from '@/features/common/components/layout/FixedMenu'
import { useMe } from '@/features/common/hooks/users/useGetMe'

export const ProfileLayout = () => {
  const [uploadPostWizardOpen, setUploadPostWizardOpen] = useState(false)
  const { data: me } = useMe()

  return (
    <div className="bg-backgroundLight h-[calc(100vh)] py-4 px-8 md:py-6 md:px-14">
      <SidebarProvider className="relative grid grid-cols-1 min-h-0 md:grid-cols-[0.3fr_1fr] grid-rows-[auto_1fr] md:gap-x-[70px] md:gap-y-0 gap-0 justify-center">
        <div className="hidden md:flex col-start-1 row-start-1 col-end-2 row-end-2">
          <Button
            className="w-full max-md:hidden"
            onClick={() => setUploadPostWizardOpen(true)}
          >
            <Plus />
            پست جدید
          </Button>
          <Button className="md:hidden">
            <Plus />
            پست جدید
          </Button>
        </div>
        <div className="hidden md:block col-start-2 row-start-1 col-end-3 row-end-2 justify-items-end">
          <img src={logo} width="80px" height="50px" />
        </div>
        <div className="md:hidden col-start-1 row-start-1 col-end-2 row-end-2 flex justify-between border-b border-geryLight pb-4 mb-4">
          <Avatar className="w-[48px] h-[48px] border border-geryLight">
            <AvatarImage
              src={me?.data.imagePath}
              className="w-full h-full object-cover"
              alt="avatar"
            />
            <AvatarFallback className="bg-geryVeryLight">
              <UserRound color="#A5A5A5A5" strokeWidth={1.5} />
            </AvatarFallback>
          </Avatar>
          <CustomeSideBarTrigger />
        </div>
        <div className="md:flex-auto max-md:hidden col-start-1 row-start-2 col-end-2 row-end-3">
          <AppSidebar />
        </div>
        <div className="col-start-1 row-start-2 col-end-2 row-end-3 md:col-start-2 md:row-start-2 md:col-end-3 md:row-end-3 h-[calc(100vh-200px)] md:h-[calc(100vh-100px)]">
          <Outlet />
        </div>
        <FixedMenu />
      </SidebarProvider>
      {uploadPostWizardOpen && (
        <DialogAndDrawerWizard
          open={uploadPostWizardOpen}
          setOpen={setUploadPostWizardOpen}
        >
          <UploadPostForm onSuccess={() => setUploadPostWizardOpen(false)} />
        </DialogAndDrawerWizard>
      )}
    </div>
  )
}
