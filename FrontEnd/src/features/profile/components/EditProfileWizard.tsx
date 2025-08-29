import { Button } from '@/features/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
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
  DrawerTrigger,
} from '@/features/common/components/ui/drawer'
import { useMediaQuery } from '@/features/common/hooks/useMediaQuery'
import { useState } from 'react'
import { EditProfileForm } from './EditProfileForm'

export const EditProfileWizard = () => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>ویرایش پروفایل</Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-6 border-none">
          <DialogHeader>
            <DialogTitle className="flex flex-col text-2xl font-bold items-center justify-center">
              ویرایش حساب
              <DialogDescription hidden></DialogDescription>
            </DialogTitle>
          </DialogHeader>
          <EditProfileForm />
        </DialogContent>
      </Dialog>
    )
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="w-full">ویرایش پروفایل</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex flex-col text-xl font-bold items-center justify-center">
              ویرایش حساب
              <DrawerDescription hidden></DrawerDescription>
            </DrawerTitle>
          </DrawerHeader>
          <EditProfileForm />
        </DrawerContent>
      </Drawer>
    )
  }
}
