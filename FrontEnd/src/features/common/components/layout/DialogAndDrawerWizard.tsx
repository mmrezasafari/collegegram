import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/features/common/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/features/common/components/ui/drawer'
import { useMediaQuery } from '@/features/common/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Iprops {
  open: boolean
  setOpen: (_state: boolean) => void
  title?: string
  className?: string
  children: ReactNode
}

export const DialogAndDrawerWizard = ({
  open,
  setOpen,
  title,
  className,
  children,
}: Iprops) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(className)}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex flex-col text-2xl font-bold items-center justify-center">
              {title}
              <DialogDescription hidden></DialogDescription>
            </DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          className={cn(className)}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex flex-col text-xl font-bold items-center justify-center">
              {title}
              <DrawerDescription hidden></DrawerDescription>
            </DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    )
  }
}
