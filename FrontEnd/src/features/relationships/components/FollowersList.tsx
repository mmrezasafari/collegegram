import {
  DialogFooter,
  DialogHeader,
} from '@/features/common/components/ui/dialog'
import { useMediaQuery } from '@/features/common/hooks/useMediaQuery'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/features/common/components/ui/dialog'
import { RelationsRow } from './RelationsRow'
import { Button } from '@/features/common/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/features/common/components/ui/drawer'
import { ScrollArea } from '@/features/common/components/ui/scroll-area'
import { useState } from 'react'
import { Separator } from '@/features/common/components/ui/separator'
import { useGetFollowers } from '../hooks/useRelations'

export const FollowersList = () => {
  const { data: followersRes } = useGetFollowers()
  const followersList = followersRes?.data
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-sm md:text-base text-secondary cursor-pointer hover:text-secondary/80">
        دنبال شونده‌
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-8">
        <DialogHeader>
          <DialogTitle className="flex justify-center text-xl font-bold">
            دنبال شونده‌‌ها
          </DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <div className="w-[350px] flex flex-col gap-8">
          <ScrollArea className="h-[400px]">
            {followersList?.map((friend) => (
              <>
                <RelationsRow
                  key={friend.id}
                  name={friend.username}
                  followerCount={friend.followerCount}
                  image={friend.imageUrl}
                />
                <Separator className="bg-geryLight h-1 my-4" />
              </>
            ))}
          </ScrollArea>
          <DialogFooter className="pl-4">
            <DialogClose asChild>
              <Button className="" type="button">
                بستن
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="text-sm text-secondary">
        دنبال شونده‌
      </DrawerTrigger>
      <DrawerContent className="h-[90%]">
        <DrawerHeader className="text-xl font-bold py-4">
          <DrawerTitle>دنبال شونده‌‌ها</DrawerTitle>
          <DrawerDescription hidden></DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-full">
          <div className="px-8 pt-4 gap-4 flex flex-col">
            {followersList?.map((friend) => (
              <RelationsRow
                key={friend.id}
                name={friend.username}
                followerCount={friend.followerCount}
                image={friend.imageUrl}
              />
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
