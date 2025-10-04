import { AvatarFallback } from '@/features/common/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  DoorClosed,
  List,
  MessageCircleIcon,
  PanelsTopLeft,
  PinIcon,
  SearchIcon,
  TagIcon,
  UserLock,
  UserRound,
  UserRoundPlus,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useMe } from '../../hooks/users/useGetMe'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Separator } from '../ui/separator'

const links = [
  {
    title: 'صفحه من',
    url: '/profile',
    icon: PinIcon,
  },
  {
    title: 'ذخیره ها',
    url: '/bookmarks',
    icon: Bookmark,
  },
  {
    title: 'پیام ها',
    url: '/messages',
    icon: MessageCircleIcon,
  },
  {
    title: 'اطلاعات',
    url: '/notifications',
    icon: BellIcon,
  },
  {
    title: 'تگ شده‌ها',
    url: '/mentions',
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

  // Utility to clear all cookies
  const clearCookies = () => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/')
    })
  }

  // Logout handler
  const handleLogout = () => {
    clearCookies()
    localStorage.clear()
    sessionStorage.clear()
<<<<<<< HEAD
    // if (isMobile) toggleSidebar()
    // navigate('/logout')
=======
    if (isMobile) toggleSidebar()
    navigate('/logout')
>>>>>>> 9c5116f0ee0e5cc2132270538d7d0dd8532ea003
  }

  const onNavigate = (url: string) => {
    navigate(url)
    if (isMobile) toggleSidebar()
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
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
                <AvatarFallback className="bg-geryVeryLight">
                  <UserRound
                    className="w-full h-full p-2"
                    color="#A5A5A5A5"
                    strokeWidth={1}
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
      </SidebarContent>
      <SidebarFooter className="max-md:bg-geryVeryLight">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton className="rounded-[75px] !py-4 !px-8 w-full h-min justify-start gap-4 cursor-pointer hover:bg-geryVeryLight text-base">
                <List />
                <span>بیشتر</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border border-geryLight w-64 rounded-4xl"
            align="center"
          >
            <DropdownMenuGroup className="flex flex-col gap-2 py-6 px-1">
              <DropdownMenuItem className="rounded-full px-8 py-4">
                <Link
                  to={'/close-friends'}
                  onClick={() => isMobile && toggleSidebar()}
                >
                  <div className="flex items-start gap-4 text-base">
                    <span>دوستان نزدیک</span>
                    <UserRoundPlus />
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-full px-8 py-4">
                <Link
                  to={'/block-list'}
                  onClick={() => isMobile && toggleSidebar()}
                >
                  <div className="flex items-start gap-4 text-base">
                    <span>لیست سیاه</span>
                    <UserLock />
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-full px-8 py-4">
                <button
                  onClick={() => {
                    handleLogout()
                    // navigate('/logout')
                    navigate('/')
                    // window.location.href = `/`
                  }}
                >
                  <div className="flex items-start gap-4 text-base">
                    <span>خروچ</span>
                    <DoorClosed />
                  </div>
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
