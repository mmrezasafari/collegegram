import { AvatarFallback } from '@/features/common/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/features/common/components/ui/sidebar'
import { Avatar, AvatarImage } from '@/features/common/components/ui/avatar'
import { PinIcon, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMe } from '../../hooks/users/useGetMe'

const links = [
  {
    title: 'صفحه من',
    url: '/profile',
    icon: PinIcon,
  },
]

export function AppSidebar() {
  const { data: me } = useMe()
  const user = me?.data
  const { toggleSidebar, isMobile } = useSidebar()
  const navigate = useNavigate()

  const onNavigate = (url: string) => {
    navigate(url)
    if (isMobile) toggleSidebar()
  }

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="w-full h-full bg-light md:sticky rounded-3xl border border-geryLight py-4"
    >
      <SidebarContent className="h-full max-md:bg-geryVeryLight">
        <SidebarHeader className="text-right px-8 py-4 md:pt-0 md:pb-4 md:px-8 border-b border-geryLight">
          <div className="flex items-center justify-end rtl:justify-start">
            <div className="group-data-[collapsible=icon]:hidden flex justify-between items-center gap-3 w-full">
              <Avatar className="w-[48px] h-[48px]">
                <AvatarImage
                  className="w-full h-full object-cover object-center scale-160"
                  alt="avatar"
                />
                <AvatarFallback className="bg-geryVeryLight">
                  <UserRound color="#A5A5A5" strokeWidth={1.5} />
                </AvatarFallback>
              </Avatar>
              <span className="text-base font-normal">{user?.username}</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            {links.map((item, index) => (
              <SidebarMenuItem
                key={index}
                className="list-none"
                onClick={() => onNavigate(item.url)}
              >
                <SidebarMenuButton className="rounded-[75px] !py-4 !px-8 w-full h-min justify-start gap-4 cursor-pointer hover:bg-geryVeryLight">
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden text-base">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
