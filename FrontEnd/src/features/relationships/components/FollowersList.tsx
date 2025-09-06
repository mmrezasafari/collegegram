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
import { useGetFollowers } from '../hooks/useRelations'

export const FollowersList = () => {
  const { data: followersRes } = useGetFollowers()
  const followersList = followersRes?.data
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <Dialog>
      <DialogTrigger className="text-base text-secondary cursor-pointer hover:text-secondary/80 space-x-1">
        <span>{followersList?.length}</span>
        <span>دنبال‌شونده</span>
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
            {followersList?.length ? (
              followersList?.map((friend) => (
                <div key={friend.id}>
                  <RelationsRow user={friend} />
                  <Separator className="bg-geryLight h-1 my-4" />
                </div>
              ))
            ) : (
              <p className="h-full text-center text-bold">
                فردی شما را دنبال نمی‌کند
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
        <span>{followersList?.length}</span>
        <span>دنبال‌شونده</span>
      </DrawerTrigger>
      <DrawerContent className="h-[90%]">
        <DrawerHeader className="text-xl font-bold py-4">
          <DrawerTitle>دنبال شونده‌‌ها</DrawerTitle>
          <DrawerDescription hidden></DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-full">
          <div className="px-8 pt-4 gap-4 flex flex-col">
            {followersList?.length ? (
              followersList?.map((friend) => (
                <RelationsRow key={friend.id} user={friend} />
              ))
            ) : (
              <p className="h-full text-center text-bold">
                فردی شما را دنبال نمی‌کند
              </p>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
