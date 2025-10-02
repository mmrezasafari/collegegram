import clsx from 'clsx'
import { Loader } from 'lucide-react'
import type React from 'react'

export const Loading = ({ className }: React.ComponentProps<'div'>) => (
  <div className={clsx('flex items-center gap-2 text-gray-400', className)}>
    <p className=" animate-pulse">در حال بارگذاری</p>
    <Loader color="#f6881f" className="animate-spin" />
  </div>
)
