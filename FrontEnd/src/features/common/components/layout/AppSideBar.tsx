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
import {
  BellIcon,
  Bookmark,
  List,
  MessageCircleIcon,
  PanelsTopLeft,
  PinIcon,
  SearchIcon,
  TagIcon,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMe } from '../../hooks/users/useGetMe'
import { Separator } from '@radix-ui/react-separator'
import { useRef, useState } from 'react'
import { Plus, Ban } from 'lucide-react'

const links = [
  {
    title: 'صفحه من',
    url: '/profile',
    icon: PinIcon,
  },
  {
    title: 'ذخیره ها',
    url: '/saves',
    icon: Bookmark,
  },
  {
    title: 'پیام ها',
    url: '/messages',
    icon: MessageCircleIcon,
  },
  {
    title: 'اطلاعات',
    url: '/info',
    icon: BellIcon,
  },
  {
    title: 'تگ شده‌ها',
    url: '/tagged',
    icon: TagIcon,
  },
]

const sidebarLinks = [
  { title: 'اکسپلور', url: '/explore', icon: PanelsTopLeft },
  { title: 'جستجو', url: '/search', icon: SearchIcon },
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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogPosition, setDialogPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const moreBtnRef = useRef<HTMLDivElement | null>(null)

  const handleMoreClick = () => {
    if (moreBtnRef.current) {
      const rect = moreBtnRef.current.getBoundingClientRect()
      setDialogPosition({
        top: rect.top + window.scrollY - 180, // show above button, adjust as needed
        left: rect.left + window.scrollX - 100, // align left edge, adjust as needed
      })
    }
    setDialogOpen(true)
  }

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className=" bg-light w-full h-[calc(100vh-200px)] md:h-[calc(100vh-100px)] md:sticky rounded-3xl border border-geryLight py-4"
    >
      <SidebarContent className="h-full max-md:bg-geryVeryLight">
        <SidebarHeader className="text-right px-8 py-4 md:pt-0 md:pb-4 md:px-8 border-b border-geryLight">
          <div className="flex items-center justify-end rtl:justify-start">
            <div className="group-data-[collapsible=icon]:hidden flex justify-between items-center gap-3 w-full">
              <Avatar className="w-[48px] h-auto">
                <AvatarImage
                  src={user?.imagePath}
                  className="w-full h-full object-contain scale-160"
                  alt="avatar"
                />
                <AvatarFallback className="bg-geryVeryLight">
                  <UserRound
                    className="w-full h-full object-cover"
                    color="#A5A5A5A5"
                    fill="#A5A5A5A5"
                    strokeWidth={0}
                  />
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
            <Separator className="my-4 h-px bg-geryLight" />
            {sidebarLinks.map((item, index) => (
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
        <div className="mt-auto px-8 pb-4">
          <div ref={moreBtnRef}>
            <SidebarMenuItem onClick={handleMoreClick} className="list-none">
              <SidebarMenuButton className="rounded-[75px] !py-4 !px-8 w-full h-min justify-start gap-4 cursor-pointer hover:bg-geryVeryLight">
                <List />
                <span>بیشتر</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        </div>
        {dialogOpen && dialogPosition && (
          <div
            className="fixed z-50"
            style={{
              top: dialogPosition.top,
              left: dialogPosition.left,
            }}
          >
            <div
              className="bg-white rounded-[32px] shadow-lg flex flex-col gap-8 px-8 py-8 min-w-[303px] min-h-[104px] border border-gray-300"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-[55px] flex items-center justify-between cursor-pointer hover:bg-gray-100 transition p-2"
                onClick={() => {}}
              >
                <span className="text-s font-medium">دوستان نزدیک</span>
                <Plus size={20} />
              </div>
              <div
                className="rounded-[55px] flex flex-row items-center justify-between cursor-pointer hover:bg-gray-100 transition p-2"
                onClick={() => {
                  setDialogOpen(false)
                  onNavigate('/blocklist')
                }}
              >
                <span className="text-s font-medium">لیست سیاه</span>
                <Ban size={20} color="#222" />
              </div>
            </div>
            {/* Overlay for closing */}
            <div
              className="fixed inset-0"
              style={{ zIndex: -1 }}
              onClick={() => setDialogOpen(false)}
            />
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
