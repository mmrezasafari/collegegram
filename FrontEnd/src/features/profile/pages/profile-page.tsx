import { Button } from '@/features/common/components/ui/button'
import { SidebarProvider } from '@/features/common/components/ui/sidebar'
import * as React from 'react'
import { ProfileSidebar } from '../components/profile-sidebar'
import { TopBar } from '../components/top-bar'
import { useGetUser } from '../hooks/useGetUsers'

export function ProfilePage(): React.ReactElement {
  // React.useEffect(() => {
  //TODO یوزر آی دی از سرور گرفته شده اینجا وارد شود
  const user = useGetUser('eed34496-4d0b-4f5e-a91a-0dd31ded3bef')
  console.log(user.data)
  // })

  return (
    <SidebarProvider>
      <ProfileSidebar />
      <main className="flex-1">
        <TopBar />
        <div className="w-full px-3 md:px-10 py-4 md:py-8 space-y-4 md:space-y-6">
          {/* Profile header */}
          <div className="flex flex-col items-center text-center gap-2 md:gap-3">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <div className="order-1 size-16 md:size-20 rounded-full overflow-hidden">
                <img
                  src="src/assets/images/Unknown.png"
                  alt="avatar"
                  className="w-full h-full object-cover object-center scale-160"
                />
              </div>
              <Button className="hidden md:inline-flex order-3 rounded-full bg-rose-400 text-white hover:bg-rose-500 h-8 px-3 text-xs">
                ویرایش پروفایل
              </Button>
              <div className="space-y-1 order-2">
                <div className="text-xs text-muted-foreground">@mahmz</div>
                <div className="text-base md:text-lg font-extrabold">
                  مهشید منز
                </div>
                <div className="text-xs text-muted-foreground">
                  Lover, not a fighter, spreading ✌️ all over the 🌎.
                </div>
              </div>
            </div>

            <div className="w-full" />
          </div>

          {/* Mobile-only*/}
          <div className="md:hidden w-full">
            <Button className="w-full rounded-full bg-rose-400 text-white hover:bg-rose-500 h-8 md:h-9 text-sm">
              ویرایش پروفایل
            </Button>
          </div>

          {/* Empty posts panel */}
          <div className="rounded-xl md:rounded-2xl bg-[#f7f7f7] h-[300px] md:h-[520px] flex items-center justify-center">
            <div className="text-center leading-6 md:leading-7 px-4">
              <div className="font-semibold text-sm md:text-base">
                هنوز هیچ پستی توی صفحت نذاشتی!
              </div>
              <div className="text-xs md:text-sm">بجنب تا دیر نشده</div>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
