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
import { Separator } from '@/features/common/components/ui/separator'
import { useGetFollowings } from '../hooks/useRelations'

export const FollowingsList = () => {
  const { data: followingsRes } = useGetFollowings()
  const followingList = followingsRes?.data
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <Dialog>
      <DialogTrigger className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1">
        <span>{followingList?.length}</span>
        <span>دنبال‌کننده‌</span>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-8">
        <DialogHeader>
          <DialogTitle className="flex justify-center text-xl font-bold">
            دنبال‌کننده‌ها
          </DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <div className="w-[350px] flex flex-col gap-8">
          <ScrollArea className="h-[400px]">
            {followingList?.length ? (
              followingList?.map((friend) => (
                <div key={friend.id}>
                  <RelationsRow key={friend.id} user={friend} />
                  <Separator className="bg-geryLight h-1 my-4" />
                </div>
              ))
            ) : (
              <p className="h-full text-center text-bold">
                فردی را دنبال نمی‌کنید
              </p>
            )}
          </ScrollArea>
          <DialogFooter>
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
    <Drawer>
      <DrawerTrigger className="text-sm text-secondary cursor-pointer hover:text-secondary/80 space-x-1">
        <span>{followingList?.length}</span>
        <span>دنبال‌کننده‌</span>
      </DrawerTrigger>
      <DrawerContent className="h-[90%]">
        <DrawerHeader className="text-xl font-bold py-4">
          <DrawerTitle>دنبال‌کننده‌ها</DrawerTitle>
          <DrawerDescription hidden></DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-full">
          <div className="px-8 pt-4 gap-4 flex flex-col">
            {followingList?.length ? (
              followingList?.map((friend) => (
                <RelationsRow key={friend.id} user={friend} />
              ))
            ) : (
              <p className="text-center">فردی را دنبال نمی‌کنید</p>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
