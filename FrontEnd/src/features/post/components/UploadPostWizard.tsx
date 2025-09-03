import { useState } from 'react'
import { Button } from '@/features/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/common/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/features/common/components/ui/drawer'
import { useMediaQuery } from '@/features/common/hooks/useMediaQuery'
import { Plus } from 'lucide-react'
import { UploadPostForm } from './UploadPostForm'

export const UploadPostWizard = () => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus />
            پست جدید
          </Button>
        </DialogTrigger>
        <DialogContent
          className="flex flex-col border-none px-20"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle hidden></DialogTitle>
            <DialogDescription hidden></DialogDescription>
          </DialogHeader>
          <UploadPostForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    )
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>
            <Plus />
            پست جدید
          </Button>
        </DrawerTrigger>
        <DrawerContent
          className="flex flex-col border-none px-8"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex flex-col text-xl font-bold items-center justify-center">
              <DrawerDescription hidden></DrawerDescription>
            </DrawerTitle>
          </DrawerHeader>
          <UploadPostForm onSuccess={() => setOpen(false)} />
        </DrawerContent>
      </Drawer>
    )
  }
}
