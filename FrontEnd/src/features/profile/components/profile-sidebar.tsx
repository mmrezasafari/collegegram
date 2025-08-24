import avatarUrl from '@/assets/images/Unknown.png'
import { Button } from '@/features/common/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from '@/features/common/components/ui/sidebar'
import { PinIcon } from 'lucide-react'

export function ProfileSidebar() {
  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="text-right">
        <SidebarTrigger className="hidden md:inline-flex" />
        <div className="flex items-center justify-end gap-2 p-2 rtl:justify-start">
          <div className="min-w-0 group-data-[collapsible=icon]:hidden flex items-center gap-2">
            <img
              src={avatarUrl}
              alt="avatar"
              className="size-6 rounded-full object-cover scale-210"
            />
            <div className="text-sm font-medium truncate">mahmz</div>
          </div>
        </div>
        <Button className="mx-2 bg-[#f5f5f5] text-foreground hover:bg-[#ebebeb] rounded-full flex justify-end items-center gap-2 pe-4 ps-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center rtl:justify-start">
          <PinIcon />
          <span className="group-data-[collapsible=icon]:hidden">صفحه من</span>
        </Button>
      </SidebarHeader>
      <SidebarContent />
    </Sidebar>
  )
}
