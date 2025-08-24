import * as React from 'react'
import { SidebarTrigger } from '@/features/common/components/ui/sidebar'

export function TopBar(): React.ReactElement {
  return (
    <div className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-14 items-center justify-between px-4 md:px-8">
        {/* Right side (RTL): Mobile sidebar trigger */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-base md:text-lg font-bold">صفحه من</h1>
        </div>
        <div />
      </div>
    </div>
  )
}
